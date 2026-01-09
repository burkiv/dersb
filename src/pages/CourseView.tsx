import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Play, Headphones, FileText, Award,
    ChevronDown, User, CheckCircle, ExternalLink
} from 'lucide-react'
import { getCourse, type Instructor, type Video } from '../data/schema'
import { useProgressStore } from '../stores/useProgressStore'
import { usePlayerStore } from '../stores/usePlayerStore'

type TabType = 'videos' | 'podcasts' | 'notes' | 'quizzes'

export function CourseView() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null)
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<TabType>('videos')
    const { watchedVideos } = useProgressStore()
    const { setTrack, setIsPlaying } = usePlayerStore()

    const course = getCourse(courseId || '')

    if (!course) {
        return (
            <div className="empty-state">
                <div className="icon">🔍</div>
                <div className="title">Ders bulunamadı</div>
                <Link to="/subjects" className="btn-glow mt-4">Derslere Dön</Link>
            </div>
        )
    }

    const hasVideos = course.instructors.length > 0
    const hasPodcasts = course.podcasts.length > 0
    const hasNotes = course.notes.length > 0
    const hasQuizzes = course.quizzes.length > 0

    // Group videos by topic
    const getVideosByTopic = (instructor: Instructor) => {
        const grouped: Record<string, Video[]> = {}
        const unmatched: Video[] = []

        for (const video of instructor.videos) {
            if (video.topicId) {
                if (!grouped[video.topicId]) grouped[video.topicId] = []
                grouped[video.topicId].push(video)
            } else {
                unmatched.push(video)
            }
        }

        return { grouped, unmatched }
    }

    const playPodcast = (podcast: typeof course.podcasts[0]) => {
        setTrack({
            id: podcast.id,
            title: podcast.title,
            artist: course.name,
            audioUrl: podcast.audioUrl
        })
        setIsPlaying(true)
    }

    // Tab Content
    const tabs: { id: TabType; label: string; icon: React.ReactNode; count: number }[] = [
        { id: 'videos', label: 'Videolar', icon: <Play size={16} />, count: course.instructors.reduce((a, i) => a + i.videos.length, 0) },
        { id: 'podcasts', label: 'Podcast', icon: <Headphones size={16} />, count: course.podcasts.length },
        { id: 'notes', label: 'Notlar', icon: <FileText size={16} />, count: course.notes.length },
        { id: 'quizzes', label: 'Testler', icon: <Award size={16} />, count: course.quizzes.length },
    ]

    return (
        <div className="space-y-4 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => selectedInstructor ? setSelectedInstructor(null) : navigate('/subjects')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {course.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold">{course.name}</h1>
                    {selectedInstructor && (
                        <p className="text-sm text-[rgb(var(--text-muted))]">{selectedInstructor.name}</p>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            {!selectedInstructor && (
                <div className="tab-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.icon}
                            <span className="hide-mobile">{tab.label}</span>
                            {tab.count > 0 && (
                                <span className="text-xs opacity-70">{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Videos Tab - Instructor Selection */}
            {activeTab === 'videos' && !selectedInstructor && (
                <div className="space-y-4">
                    {!hasVideos ? (
                        <div className="empty-state">
                            <div className="icon">🎬</div>
                            <div className="title">Henüz video eklenmemiş</div>
                            <div className="description">
                                Playlist eklemek için fetch-playlist scripti kullan
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold">Kaynak Seçin</h2>
                            {course.instructors.map((instructor) => {
                                const watchedCount = instructor.videos.filter(v => watchedVideos.includes(v.id)).length
                                const progress = instructor.videos.length > 0 ? Math.round((watchedCount / instructor.videos.length) * 100) : 0

                                return (
                                    <motion.button
                                        key={instructor.id}
                                        onClick={() => setSelectedInstructor(instructor)}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="glass-card p-4 flex items-center gap-4 w-full text-left"
                                    >
                                        {instructor.thumbnail ? (
                                            <img src={instructor.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                                                <User size={28} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold">{instructor.name}</p>
                                            {instructor.description && (
                                                <p className="text-sm text-[rgb(var(--text-muted))]">{instructor.description}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 text-xs text-[rgb(var(--text-muted))]">
                                                <span>{instructor.videos.length} video</span>
                                                <span>•</span>
                                                <span className="text-[rgb(var(--primary-light))]">%{progress} tamamlandı</span>
                                            </div>
                                            <div className="progress-bar mt-2">
                                                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </>
                    )}
                </div>
            )}

            {/* Videos Tab - Video List */}
            {activeTab === 'videos' && selectedInstructor && (
                <div className="space-y-3">
                    {(() => {
                        const { grouped, unmatched } = getVideosByTopic(selectedInstructor)
                        const allTopics = [...course.topics, ...(unmatched.length > 0 ? [{ id: 'other', name: 'Diğer Videolar', keywords: [] }] : [])]

                        return allTopics.map((topic) => {
                            const topicVideos = topic.id === 'other' ? unmatched : (grouped[topic.id] || [])
                            if (topicVideos.length === 0) return null

                            const isExpanded = expandedTopic === topic.id
                            const watchedCount = topicVideos.filter(v => watchedVideos.includes(v.id)).length

                            return (
                                <motion.div key={topic.id} className="glass-card overflow-hidden">
                                    <button
                                        onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                                        className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex-1 text-left">
                                            <p className="font-medium">{topic.name}</p>
                                            <p className="text-xs text-[rgb(var(--text-muted))]">
                                                {watchedCount}/{topicVideos.length} video izlendi
                                            </p>
                                        </div>
                                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                            <ChevronDown size={18} className="text-[rgb(var(--text-muted))]" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden border-t border-white/5"
                                            >
                                                {topicVideos.map((video) => {
                                                    const isWatched = watchedVideos.includes(video.id)
                                                    return (
                                                        <Link
                                                            key={video.id}
                                                            to={`/watch/${courseId}/${selectedInstructor.id}/${video.youtubeId}`}
                                                            className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                                                        >
                                                            <div className="video-thumbnail w-24 shrink-0">
                                                                <img src={video.thumbnail} alt="" />
                                                                {video.duration && <span className="duration">{video.duration}</span>}
                                                                {isWatched && (
                                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                                        <CheckCircle size={20} className="text-emerald-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className={`text-sm line-clamp-2 flex-1 ${isWatched ? 'text-white/50' : ''}`}>
                                                                {video.title}
                                                            </p>
                                                        </Link>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })
                    })()}
                </div>
            )}

            {/* Podcasts Tab */}
            {activeTab === 'podcasts' && (
                <div className="space-y-3">
                    {!hasPodcasts ? (
                        <div className="empty-state">
                            <div className="icon">🎧</div>
                            <div className="title">Henüz podcast eklenmemiş</div>
                            <div className="description">
                                public/podcasts klasörüne MP3 ekle ve schema.ts'e kaydet
                            </div>
                        </div>
                    ) : (
                        course.podcasts.map((podcast) => (
                            <motion.button
                                key={podcast.id}
                                onClick={() => playPodcast(podcast)}
                                whileHover={{ scale: 1.01 }}
                                className="glass-card p-4 flex items-center gap-4 w-full text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <Headphones size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{podcast.title}</p>
                                    {podcast.duration && (
                                        <p className="text-xs text-[rgb(var(--text-muted))]">{podcast.duration}</p>
                                    )}
                                </div>
                                <Play size={20} className="text-[rgb(var(--primary-light))]" />
                            </motion.button>
                        ))
                    )}
                </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
                <div className="space-y-3">
                    {!hasNotes ? (
                        <div className="empty-state">
                            <div className="icon">📄</div>
                            <div className="title">Henüz not eklenmemiş</div>
                            <div className="description">
                                public/notes klasörüne PDF ekle ve schema.ts'e kaydet
                            </div>
                        </div>
                    ) : (
                        course.notes.map((note) => (
                            <a
                                key={note.id}
                                href={note.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-card p-4 flex items-center gap-4 block"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{note.title}</p>
                                    {note.pageCount && (
                                        <p className="text-xs text-[rgb(var(--text-muted))]">{note.pageCount} sayfa</p>
                                    )}
                                </div>
                                <ExternalLink size={18} className="text-[rgb(var(--text-muted))]" />
                            </a>
                        ))
                    )}
                </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
                <div className="space-y-3">
                    {!hasQuizzes ? (
                        <div className="empty-state">
                            <div className="icon">📝</div>
                            <div className="title">Henüz test eklenmemiş</div>
                            <div className="description">
                                schema.ts dosyasındaki quizzes dizisine test ekle
                            </div>
                        </div>
                    ) : (
                        course.quizzes.map((quiz) => (
                            <Link
                                key={quiz.id}
                                to={`/quiz/${courseId}/${quiz.id}`}
                                className="glass-card p-4 flex items-center gap-4 block"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <Award size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{quiz.title}</p>
                                    <p className="text-xs text-[rgb(var(--text-muted))]">
                                        {quiz.questions.length} soru
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
