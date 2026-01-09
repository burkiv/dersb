// ============================================
// KPSS PWA - Multi-Source Data Schema
// ============================================
// Bu dosya, dersleri, hocaları, videoları, podcastleri, notları ve testleri ilişkilendirir.

// Import playlist data
import tarihRamazanYetgin from './playlists/tarih_ramazan-yetgin.json'

// ========== TYPE DEFINITIONS ==========

/** Video bilgisi (YouTube'dan çekilir) */
export interface Video {
    id: string
    title: string
    youtubeId: string
    thumbnail: string
    duration?: string
    topicId?: string | null
}

/** Eğitmen/Kaynak */
export interface Instructor {
    id: string
    name: string
    description?: string
    playlistId: string
    thumbnail?: string
    videos: Video[]
}

/** Podcast */
export interface Podcast {
    id: string
    title: string
    audioUrl: string
    topicId: string
    duration?: string
    description?: string
}

/** PDF Not */
export interface Note {
    id: string
    title: string
    pdfUrl: string
    topicId: string
    pageCount?: number
}

/** Test Sorusu */
export interface QuizQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation?: string
}

/** Test */
export interface Quiz {
    id: string
    title: string
    topicId: string
    questions: QuizQuestion[]
}

/** Konu (Ünite) */
export interface Topic {
    id: string
    name: string
    keywords: string[]
}

/** Ana Ders */
export interface Course {
    id: string
    name: string
    icon: string
    color: string
    topics: Topic[]
    instructors: Instructor[]
    podcasts: Podcast[]      // Podcast listesi
    notes: Note[]            // PDF notları
    quizzes: Quiz[]          // Testler
}

/** Tüm veri yapısı */
export interface CourseData {
    courses: Course[]
}

// ========== TOPIC DEFINITIONS ==========

export const topicMappings: Record<string, Topic[]> = {
    tarih: [
        { id: 'tarih-inkilaplar', name: 'Atatürk Dönemi ve İnkılaplar', keywords: ['atatürk', 'inkılap', 'inkılapları', 'ilkeleri', 'iç politika'] },
        { id: 'tarih-kurtulus', name: 'Kurtuluş Savaşı ve Milli Mücadele', keywords: ['milli mücadele', 'tbmm', 'muharebeler', 'mondros', 'sakarya', 'dumlupınar'] },
        { id: 'tarih-osmanli-kurulus', name: 'Osmanlı Devleti Tarihi', keywords: ['osmanlı', 'kuruluş dönemi', 'yükselme dönemi', 'duraklama dönemi', 'gerileme dönemi', 'xix.yüzyıl', 'xx.yüzyıl', 'xviii.yüzyıl', 'xvii.yüzyıl'] },
        { id: 'tarih-ilk-turk-islam', name: 'İlk Türk İslam Devletleri', keywords: ['ilk türk islam', 'anadolu selçuklu', 'karahanlı', 'gazneli'] },
        { id: 'tarih-islamiyet-oncesi', name: 'İslamiyet Öncesi Türk Tarihi', keywords: ['islamiyet öncesi', 'ilk türk devletleri', 'göktürk', 'hun', 'uygur'] },
    ],
    turkce: [
        { id: 'turkce-paragraf', name: 'Paragraf', keywords: ['paragraf', 'ana düşünce', 'yardımcı düşünce'] },
        { id: 'turkce-dil-bilgisi', name: 'Dil Bilgisi', keywords: ['dil bilgisi', 'sözcük türleri', 'fiil', 'isim', 'sıfat'] },
        { id: 'turkce-anlam-bilgisi', name: 'Anlam Bilgisi', keywords: ['anlam', 'eş anlam', 'zıt anlam', 'mecaz'] },
        { id: 'turkce-cumle-bilgisi', name: 'Cümle Bilgisi', keywords: ['cümle', 'özne', 'yüklem', 'nesne'] },
    ],
    matematik: [
        { id: 'mat-sayilar', name: 'Sayılar', keywords: ['sayılar', 'doğal', 'tam sayı', 'rasyonel'] },
        { id: 'mat-bolme-bolunebilme', name: 'Bölme ve Bölünebilme', keywords: ['bölme', 'bölünebilme', 'ebob', 'ekok'] },
        { id: 'mat-problemler', name: 'Problemler', keywords: ['problem', 'yaş', 'işçi', 'havuz', 'yüzde'] },
        { id: 'mat-denklemler', name: 'Denklemler', keywords: ['denklem', 'eşitsizlik', 'bilinmeyen'] },
    ],
    vatandaslik: [
        { id: 'vat-anayasa', name: 'Anayasa Hukuku', keywords: ['anayasa', 'temel hak', 'yasama', 'yürütme', 'yargı'] },
        { id: 'vat-idare', name: 'İdare Hukuku', keywords: ['idare', 'kamu', 'devlet teşkilatı'] },
        { id: 'vat-insan-haklari', name: 'İnsan Hakları', keywords: ['insan hakları', 'özgürlük', 'aihm'] },
    ],
    cografya: [
        { id: 'cog-fiziki', name: 'Fiziki Coğrafya', keywords: ['fiziki', 'yer şekilleri', 'dağ', 'ova', 'akarsu'] },
        { id: 'cog-iklim', name: 'İklim', keywords: ['iklim', 'sıcaklık', 'yağış', 'basınç', 'rüzgar'] },
        { id: 'cog-turkiye', name: 'Türkiye Coğrafyası', keywords: ['türkiye', 'bölge', 'karadeniz', 'akdeniz', 'ege'] },
        { id: 'cog-nufus', name: 'Nüfus ve Yerleşme', keywords: ['nüfus', 'göç', 'yerleşme', 'köy', 'şehir'] },
    ],
}

// ========== COURSE DATA ==========
// Podcast, not ve testleri burada ekle

export const courseData: CourseData = {
    courses: [
        {
            id: 'tarih',
            name: 'Tarih',
            icon: '🏛️',
            color: 'from-amber-500 to-orange-600',
            topics: topicMappings.tarih,
            instructors: [
                tarihRamazanYetgin.instructor as Instructor
            ],
            // ========== PODCASTLER ==========
            // Podcast eklemek için aşağıya ekle
            podcasts: [
                // Örnek:
                // {
                //     id: 'tarih-islamiyet-oncesi-podcast',
                //     title: 'İslamiyet Öncesi Türk Tarihi - Podcast',
                //     audioUrl: '/podcasts/tarih_islamiyet-oncesi.mp3',
                //     topicId: 'tarih-islamiyet-oncesi',
                //     duration: '25:30',
                //     description: 'NotebookLM ile oluşturuldu'
                // }
            ],
            // ========== PDF NOTLARI ==========
            // PDF notları eklemek için aşağıya ekle
            notes: [
                // Örnek:
                // {
                //     id: 'tarih-islamiyet-oncesi-note',
                //     title: 'İslamiyet Öncesi - Strateji Notları',
                //     pdfUrl: '/notes/tarih_islamiyet-oncesi.pdf',
                //     topicId: 'tarih-islamiyet-oncesi',
                //     pageCount: 15
                // }
            ],
            // ========== TESTLER ==========
            // Manuel test eklemek için aşağıya ekle
            quizzes: [
                // Örnek:
                // {
                //     id: 'tarih-osmanli-test-1',
                //     title: 'Osmanlı Kuruluş Dönemi Testi',
                //     topicId: 'tarih-osmanli-kurulus',
                //     questions: [
                //         {
                //             question: 'Osmanlı Devleti\'nin kurucusu kimdir?',
                //             options: ['Ertuğrul Gazi', 'Osman Bey', 'Orhan Bey', 'I. Murad'],
                //             correctIndex: 1,
                //             explanation: 'Osmanlı Devleti 1299\'da Osman Bey tarafından kuruldu.'
                //         }
                //     ]
                // }
            ]
        },
        {
            id: 'turkce',
            name: 'Türkçe',
            icon: '📚',
            color: 'from-emerald-500 to-teal-600',
            topics: topicMappings.turkce,
            instructors: [],
            podcasts: [],
            notes: [],
            quizzes: []
        },
        {
            id: 'matematik',
            name: 'Matematik',
            icon: '🔢',
            color: 'from-blue-500 to-indigo-600',
            topics: topicMappings.matematik,
            instructors: [],
            podcasts: [],
            notes: [],
            quizzes: []
        },
        {
            id: 'vatandaslik',
            name: 'Vatandaşlık',
            icon: '⚖️',
            color: 'from-rose-500 to-pink-600',
            topics: topicMappings.vatandaslik,
            instructors: [],
            podcasts: [],
            notes: [],
            quizzes: []
        },
        {
            id: 'cografya',
            name: 'Coğrafya',
            icon: '🌍',
            color: 'from-cyan-500 to-sky-600',
            topics: topicMappings.cografya,
            instructors: [],
            podcasts: [],
            notes: [],
            quizzes: []
        }
    ]
}

// ========== HELPER FUNCTIONS ==========

export function getCourse(courseId: string): Course | undefined {
    return courseData.courses.find(c => c.id === courseId)
}

export function getInstructor(courseId: string, instructorId: string): Instructor | undefined {
    const course = getCourse(courseId)
    return course?.instructors.find(i => i.id === instructorId)
}

export function getPodcastsByTopic(courseId: string, topicId: string): Podcast[] {
    const course = getCourse(courseId)
    return course?.podcasts.filter(p => p.topicId === topicId) || []
}

export function getNotesByTopic(courseId: string, topicId: string): Note[] {
    const course = getCourse(courseId)
    return course?.notes.filter(n => n.topicId === topicId) || []
}

export function getQuizzesByTopic(courseId: string, topicId: string): Quiz[] {
    const course = getCourse(courseId)
    return course?.quizzes.filter(q => q.topicId === topicId) || []
}

export function getAllPodcasts(courseId: string): Podcast[] {
    return getCourse(courseId)?.podcasts || []
}

export function getAllNotes(courseId: string): Note[] {
    return getCourse(courseId)?.notes || []
}

export function getAllQuizzes(courseId: string): Quiz[] {
    return getCourse(courseId)?.quizzes || []
}
