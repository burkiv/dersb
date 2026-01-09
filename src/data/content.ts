// Content Data Structure for KPSS Study App
// Edit this file to add subjects, topics, videos, and quizzes

export interface Video {
    id: string
    title: string
    youtubeUrl: string // YouTube video URL
    duration?: string // e.g., "15:30"
}

export interface Podcast {
    id: string
    title: string
    audioUrl: string // Path to MP3 file or URL
    duration?: string
}

export interface QuizQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation?: string
}

export interface Quiz {
    id: string
    title: string
    questions: QuizQuestion[]
}

export interface Topic {
    id: string
    title: string
    description?: string
    video?: Video
    podcast?: Podcast
    quiz?: Quiz // Manual quiz (if AI quiz not used)
    notes?: string // Markdown notes
    keywords?: string[] // For AI quiz generation context
}

export interface Subject {
    id: string
    title: string
    icon: string // Emoji or icon name
    color: string // Gradient color (e.g., "from-violet-500 to-purple-600")
    topics: Topic[]
}

export interface ContentData {
    subjects: Subject[]
}

// ============================================
// BURASI SENİN İÇERİK EKLEYECEĞİN YER!
// ============================================

export const content: ContentData = {
    subjects: [
        {
            id: 'tarih',
            title: 'Tarih',
            icon: '🏛️',
            color: 'from-amber-500 to-orange-600',
            topics: [
                {
                    id: 'tarih-osmanli-kurulus',
                    title: 'Osmanlı Kuruluş Dönemi',
                    description: 'Osmanlı Devleti\'nin kuruluşu, Osman Bey ve ilk dönem fetihleri',
                    video: {
                        id: 'tarih-osmanli-kurulus-v1',
                        title: 'Osmanlı Kuruluş Dönemi - Özet',
                        youtubeUrl: 'https://www.youtube.com/watch?v=EXAMPLE1', // ← Buraya gerçek link koy
                        duration: '25:00'
                    },
                    keywords: ['Osman Bey', 'Söğüt', 'Bizans', 'Bursa fethi', 'Orhan Bey'],
                    quiz: {
                        id: 'tarih-osmanli-kurulus-q1',
                        title: 'Osmanlı Kuruluş Testi',
                        questions: [
                            {
                                question: 'Osmanlı Devleti\'nin kurucusu kimdir?',
                                options: ['Ertuğrul Gazi', 'Osman Bey', 'Orhan Bey', 'I. Murad'],
                                correctIndex: 1,
                                explanation: 'Osmanlı Devleti\'nin kurucusu Osman Bey\'dir (1299).'
                            },
                            {
                                question: 'Osmanlı Devleti\'nin ilk başkenti neresidir?',
                                options: ['İstanbul', 'Bursa', 'Söğüt', 'Edirne'],
                                correctIndex: 2,
                                explanation: 'İlk başkent Söğüt, daha sonra Bursa başkent olmuştur.'
                            }
                        ]
                    }
                },
                {
                    id: 'tarih-osmanli-yukselis',
                    title: 'Osmanlı Yükseliş Dönemi',
                    description: 'Fatih Sultan Mehmet, İstanbul\'un Fethi ve imparatorluk dönemi',
                    video: {
                        id: 'tarih-osmanli-yukselis-v1',
                        title: 'Yükseliş Dönemi - Özet',
                        youtubeUrl: 'https://www.youtube.com/watch?v=EXAMPLE2',
                        duration: '30:00'
                    },
                    keywords: ['Fatih', 'İstanbul fethi', 'Kanuni', 'Preveze', 'Mohaç']
                }
            ]
        },
        {
            id: 'turkce',
            title: 'Türkçe',
            icon: '📚',
            color: 'from-emerald-500 to-teal-600',
            topics: [
                {
                    id: 'turkce-paragraf',
                    title: 'Paragraf Soruları',
                    description: 'Paragrafta ana düşünce, yardımcı düşünce, başlık bulma',
                    video: {
                        id: 'turkce-paragraf-v1',
                        title: 'Paragraf Teknikleri',
                        youtubeUrl: 'https://www.youtube.com/watch?v=EXAMPLE3',
                        duration: '20:00'
                    },
                    keywords: ['ana düşünce', 'yardımcı düşünce', 'paragraf yapısı']
                }
            ]
        },
        {
            id: 'matematik',
            title: 'Matematik',
            icon: '🔢',
            color: 'from-blue-500 to-indigo-600',
            topics: [
                {
                    id: 'mat-sayilar',
                    title: 'Sayılar ve İşlemler',
                    description: 'Doğal sayılar, tam sayılar, rasyonel sayılar',
                    video: {
                        id: 'mat-sayilar-v1',
                        title: 'Sayılar Konu Anlatımı',
                        youtubeUrl: 'https://www.youtube.com/watch?v=EXAMPLE4',
                        duration: '18:00'
                    },
                    keywords: ['doğal sayılar', 'tam sayılar', 'EBOB EKOK', 'bölünebilme']
                }
            ]
        },
        {
            id: 'vatandaslik',
            title: 'Vatandaşlık',
            icon: '⚖️',
            color: 'from-rose-500 to-pink-600',
            topics: [
                {
                    id: 'vat-anayasa',
                    title: 'Anayasa Hukuku',
                    description: '1982 Anayasası, temel haklar ve özgürlükler',
                    video: {
                        id: 'vat-anayasa-v1',
                        title: 'Anayasa Hukuku Özet',
                        youtubeUrl: 'https://www.youtube.com/watch?v=EXAMPLE5',
                        duration: '22:00'
                    },
                    keywords: ['1982 Anayasası', 'temel haklar', 'yasama', 'yürütme', 'yargı']
                }
            ]
        },
        {
            id: 'cografya',
            title: 'Coğrafya',
            icon: '🌍',
            color: 'from-cyan-500 to-sky-600',
            topics: [
                {
                    id: 'cog-turkiye',
                    title: 'Türkiye\'nin Fiziki Coğrafyası',
                    description: 'Türkiye\'nin yer şekilleri, iklimi, bitki örtüsü',
                    video: {
                        id: 'cog-turkiye-v1',
                        title: 'Türkiye Fiziki Coğrafya',
                        youtubeUrl: 'https://www.youtube.com/watch?v=EXAMPLE6',
                        duration: '28:00'
                    },
                    keywords: ['Türkiye coğrafyası', 'yeryüzü şekilleri', 'iklim', 'akarsular']
                }
            ]
        }
    ]
}

// Helper function to get a subject by ID
export function getSubject(subjectId: string): Subject | undefined {
    return content.subjects.find(s => s.id === subjectId)
}

// Helper function to get a topic by subject and topic ID
export function getTopic(subjectId: string, topicId: string): Topic | undefined {
    const subject = getSubject(subjectId)
    return subject?.topics.find(t => t.id === topicId)
}

// Helper to extract YouTube video ID from URL
export function getYouTubeVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
}
