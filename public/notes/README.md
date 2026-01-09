# KPSS PDF Notları

Bu klasöre PDF formatındaki ders notlarını ekle.

## Dosya İsimlendirmesi
```
{ders}_{konu}.pdf
```

Örnekler:
- `tarih_islamiyet-oncesi.pdf`
- `turkce_paragraf.pdf`
- `matematik_sayilar.pdf`

## Schema'ya Ekleme
`src/data/schema.ts` dosyasındaki ilgili dersin `notes` dizisine ekle:
```typescript
notes: [
  {
    id: 'tarih-islamiyet-oncesi-note',
    title: 'İslamiyet Öncesi - Özet Notlar',
    pdfUrl: '/notes/tarih_islamiyet-oncesi.pdf',
    topicId: 'tarih-islamiyet-oncesi'
  }
]
```
