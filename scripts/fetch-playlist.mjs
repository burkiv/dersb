#!/usr/bin/env node
/**
 * ============================================
 * KPSS PWA - YouTube Playlist Automation Script
 * ============================================
 * 
 * Bu script YouTube Data API kullanarak playlist'teki videoları çeker
 * ve KPSS data şemasına uygun JSON dosyası oluşturur.
 * 
 * KULLANIM:
 * 1. YouTube Data API key al: https://console.cloud.google.com/
 * 2. .env dosyasına YOUTUBE_API_KEY ekle
 * 3. script'i çalıştır:
 *    node scripts/fetch-playlist.mjs --playlist PLxxxxxx --course tarih --instructor "Ramazan Yetgin"
 * 
 * PARAMETRELER:
 * --playlist    : YouTube Playlist ID (zorunlu)
 * --course      : Ders ID'si: tarih, turkce, matematik, vatandaslik, cografya (zorunlu)
 * --instructor  : Eğitmen adı (zorunlu)
 * --description : Eğitmen açıklaması (opsiyonel, örn: "Detaylı Anlatım")
 * --output      : Çıktı dosya adı (opsiyonel, varsayılan: data/{course}_{instructor}.json)
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ========== TOPIC MAPPINGS (schema.ts ile senkron) ==========
// ÖNEMLİ: Sıralama önemli! Daha spesifik konular önce gelmeli.
const topicMappings = {
    tarih: [
        // Atatürk dönemi (en spesifik - önce kontrol edilmeli)
        { id: 'tarih-inkilaplar', keywords: ['atatürk', 'inkılap', 'inkılapları', 'ilkeleri', 'iç politika'] },
        // Kurtuluş savaşı
        { id: 'tarih-kurtulus', keywords: ['milli mücadele', 'tbmm', 'muharebeler', 'mondros', 'sakarya', 'dumlupınar'] },
        // Osmanlı (geniş - sonra kontrol)
        { id: 'tarih-osmanli-kurulus', keywords: ['osmanlı', 'kuruluş dönemi', 'yükselme dönemi', 'duraklama dönemi', 'gerileme dönemi', 'xix.yüzyıl', 'xx.yüzyıl', 'xviii.yüzyıl', 'xvii.yüzyıl'] },
        // Selçuklu / İlk Türk İslam
        { id: 'tarih-ilk-turk-islam', keywords: ['ilk türk islam', 'anadolu selçuklu', 'karahanlı', 'gazneli'] },
        // İslamiyet öncesi (en son - fallback için değil, sadece spesifik başlıklar)
        { id: 'tarih-islamiyet-oncesi', keywords: ['islamiyet öncesi', 'ilk türk devletleri', 'göktürk', 'hun', 'uygur'] },
    ],
    turkce: [
        { id: 'turkce-paragraf', keywords: ['paragraf', 'ana düşünce', 'yardımcı düşünce'] },
        { id: 'turkce-dil-bilgisi', keywords: ['dil bilgisi', 'sözcük türleri', 'fiil', 'isim', 'sıfat'] },
        { id: 'turkce-anlam-bilgisi', keywords: ['anlam', 'eş anlam', 'zıt anlam', 'mecaz'] },
        { id: 'turkce-cumle-bilgisi', keywords: ['cümle', 'özne', 'yüklem', 'nesne'] },
    ],
    matematik: [
        { id: 'mat-sayilar', keywords: ['sayılar', 'doğal', 'tam sayı', 'rasyonel'] },
        { id: 'mat-bolme-bolunebilme', keywords: ['bölme', 'bölünebilme', 'ebob', 'ekok'] },
        { id: 'mat-problemler', keywords: ['problem', 'yaş', 'işçi', 'havuz', 'yüzde'] },
        { id: 'mat-denklemler', keywords: ['denklem', 'eşitsizlik', 'bilinmeyen'] },
    ],
    vatandaslik: [
        { id: 'vat-anayasa', keywords: ['anayasa', 'temel hak', 'yasama', 'yürütme', 'yargı'] },
        { id: 'vat-idare', keywords: ['idare', 'kamu', 'devlet teşkilatı'] },
        { id: 'vat-insan-haklari', keywords: ['insan hakları', 'özgürlük', 'aihm'] },
    ],
    cografya: [
        { id: 'cog-fiziki', keywords: ['fiziki', 'yer şekilleri', 'dağ', 'ova', 'akarsu'] },
        { id: 'cog-iklim', keywords: ['iklim', 'sıcaklık', 'yağış', 'basınç', 'rüzgar'] },
        { id: 'cog-turkiye', keywords: ['türkiye', 'bölge', 'karadeniz', 'akdeniz', 'ege'] },
        { id: 'cog-nufus', keywords: ['nüfus', 'göç', 'yerleşme', 'köy', 'şehir'] },
    ],
}

// Turkish lowercase helper function
function turkishLower(str) {
    return str
        .replace(/İ/g, 'i')
        .replace(/I/g, 'ı')
        .replace(/Ş/g, 'ş')
        .replace(/Ğ/g, 'ğ')
        .replace(/Ü/g, 'ü')
        .replace(/Ö/g, 'ö')
        .replace(/Ç/g, 'ç')
        .toLowerCase()
}

// ========== HELPERS ==========

function parseArgs() {
    const args = process.argv.slice(2)
    const result = {}

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].substring(2)
            const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true
            result[key] = value
            if (value !== true) i++
        }
    }

    return result
}

function matchTopic(courseId, videoTitle) {
    const topics = topicMappings[courseId]
    if (!topics) return null

    const lowerTitle = turkishLower(videoTitle)

    for (const topic of topics) {
        for (const keyword of topic.keywords) {
            if (lowerTitle.includes(turkishLower(keyword))) {
                return topic.id
            }
        }
    }

    return null
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data))
                } catch (e) {
                    reject(new Error(`JSON parse error: ${data.substring(0, 200)}`))
                }
            })
        }).on('error', reject)
    })
}

async function fetchPlaylistItems(playlistId, apiKey, pageToken = '') {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?` +
        `part=snippet,contentDetails` +
        `&playlistId=${playlistId}` +
        `&maxResults=50` +
        `&key=${apiKey}` +
        (pageToken ? `&pageToken=${pageToken}` : '')

    return httpsGet(url)
}

async function fetchVideoDetails(videoIds, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/videos?` +
        `part=contentDetails` +
        `&id=${videoIds.join(',')}` +
        `&key=${apiKey}`

    return httpsGet(url)
}

function parseDuration(isoDuration) {
    // PT1H23M45S -> 1:23:45
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return ''

    const hours = match[1] || ''
    const minutes = match[2] || '0'
    const seconds = match[3] || '0'

    if (hours) {
        return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
    }
    return `${minutes}:${seconds.padStart(2, '0')}`
}

// ========== MAIN ==========

async function main() {
    const args = parseArgs()

    // Validate required args
    if (!args.playlist || !args.course || !args.instructor) {
        console.error(`
╔══════════════════════════════════════════════════════════════╗
║  KPSS PWA - YouTube Playlist Fetcher                         ║
╚══════════════════════════════════════════════════════════════╝

KULLANIM:
  node scripts/fetch-playlist.mjs \\
    --playlist PLxxxxxx \\
    --course tarih \\
    --instructor "Ramazan Yetgin" \\
    --description "Detaylı Anlatım"

PARAMETRELER:
  --playlist     YouTube Playlist ID (zorunlu)
  --course       Ders ID: tarih, turkce, matematik, vatandaslik, cografya (zorunlu)
  --instructor   Eğitmen adı (zorunlu)
  --description  Kaynak açıklaması (opsiyonel)
  --output       Çıktı dosyası (opsiyonel)

ÖNCESİNDE:
  .env dosyasına YOUTUBE_API_KEY=xxx ekleyin
  veya YOUTUBE_API_KEY environment variable olarak set edin
`)
        process.exit(1)
    }

    // Get API key
    let apiKey = process.env.YOUTUBE_API_KEY

    // Try reading from .env
    if (!apiKey) {
        try {
            const envPath = path.join(__dirname, '..', '.env')
            const envContent = fs.readFileSync(envPath, 'utf-8')
            const match = envContent.match(/YOUTUBE_API_KEY=(.+)/)
            if (match) apiKey = match[1].trim()
        } catch { }
    }

    if (!apiKey) {
        console.error('❌ YOUTUBE_API_KEY bulunamadı!')
        console.error('   .env dosyasına ekleyin veya environment variable olarak set edin.')
        process.exit(1)
    }

    const { playlist, course, instructor, description } = args
    const instructorSlug = slugify(instructor)
    const outputFile = args.output || `src/data/playlists/${course}_${instructorSlug}.json`

    console.log(`\n🎬 Playlist çekiliyor: ${playlist}`)
    console.log(`📚 Ders: ${course}`)
    console.log(`👨‍🏫 Eğitmen: ${instructor}`)
    console.log('')

    // Fetch all playlist items
    const allVideos = []
    let pageToken = ''
    let pageCount = 0

    do {
        const response = await fetchPlaylistItems(playlist, apiKey, pageToken)

        if (response.error) {
            console.error('❌ API Hatası:', response.error.message)
            process.exit(1)
        }

        const items = response.items || []

        for (const item of items) {
            const snippet = item.snippet
            const videoId = item.contentDetails?.videoId

            if (!videoId || snippet.title === 'Private video' || snippet.title === 'Deleted video') {
                continue
            }

            allVideos.push({
                id: `${instructorSlug}-${videoId}`,
                title: snippet.title,
                youtubeId: videoId,
                thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
                position: snippet.position,
                topicId: matchTopic(course, snippet.title)
            })
        }

        pageToken = response.nextPageToken
        pageCount++
        process.stdout.write(`\r📥 Sayfa ${pageCount} çekildi (${allVideos.length} video)`)

    } while (pageToken)

    console.log(`\n✅ Toplam ${allVideos.length} video bulundu\n`)

    // Fetch video durations
    console.log('⏱️ Video süreleri alınıyor...')
    const videoIds = allVideos.map(v => v.youtubeId)
    const batchSize = 50

    for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize)
        const response = await fetchVideoDetails(batch, apiKey)

        if (response.items) {
            for (const item of response.items) {
                const video = allVideos.find(v => v.youtubeId === item.id)
                if (video && item.contentDetails?.duration) {
                    video.duration = parseDuration(item.contentDetails.duration)
                }
            }
        }

        process.stdout.write(`\r⏱️ ${Math.min(i + batchSize, videoIds.length)}/${videoIds.length} video işlendi`)
    }

    console.log('\n')

    // Sort by position
    allVideos.sort((a, b) => a.position - b.position)

    // Remove position field (internal use only)
    allVideos.forEach(v => delete v.position)

    // Topic statistics
    const topicStats = {}
    let unmatchedCount = 0

    for (const video of allVideos) {
        if (video.topicId) {
            topicStats[video.topicId] = (topicStats[video.topicId] || 0) + 1
        } else {
            unmatchedCount++
        }
    }

    console.log('📊 Konu Eşleştirme İstatistikleri:')
    for (const [topicId, count] of Object.entries(topicStats)) {
        console.log(`   ${topicId}: ${count} video`)
    }
    if (unmatchedCount > 0) {
        console.log(`   ⚠️ Eşleşmeyen: ${unmatchedCount} video`)
    }
    console.log('')

    // Create output structure
    const output = {
        _generated: new Date().toISOString(),
        _playlistId: playlist,
        _courseId: course,
        instructor: {
            id: instructorSlug,
            name: instructor,
            description: description || '',
            playlistId: playlist,
            thumbnail: allVideos[0]?.thumbnail || '',
            videoCount: allVideos.length,
            videos: allVideos
        }
    }

    // Write output
    const outputDir = path.dirname(path.join(__dirname, '..', outputFile))
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputPath = path.join(__dirname, '..', outputFile)
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')

    console.log(`✅ JSON dosyası oluşturuldu: ${outputFile}`)
    console.log('')
    console.log('📌 Sonraki Adım:')
    console.log(`   Bu JSON'u src/data/schema.ts içindeki instructors dizisine ekleyin.`)
}

main().catch(err => {
    console.error('❌ Hata:', err.message)
    process.exit(1)
})
