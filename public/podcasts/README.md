# KPSS Podcastler

Bu klasöre NotebookLM veya diğer kaynaklardan oluşturduğun podcast MP3 dosyalarını ekle.

## Dosya İsimlendirmesi
Dosyaları şu formatta isimlendir:
```
{ders}_{konu}.mp3
```

Örnekler:
- `tarih_islamiyet-oncesi.mp3`
- `tarih_osmanli-kurulus.mp3`
- `turkce_paragraf.mp3`

## Schema'ya Ekleme
`src/data/schema.ts` dosyasındaki ilgili dersin `podcasts` dizisine ekle:
```typescript
podcasts: [
  {
    id: 'tarih-islamiyet-oncesi-podcast',
    title: 'İslamiyet Öncesi Türk Tarihi - Podcast',
    audioUrl: '/podcasts/tarih_islamiyet-oncesi.mp3',
    topicId: 'tarih-islamiyet-oncesi',
    duration: '25:30' // opsiyonel
  }
]
```
