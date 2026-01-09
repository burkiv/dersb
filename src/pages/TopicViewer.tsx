import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Headphones, FileQuestion, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import { getSubject, getTopic, getYouTubeVideoId } from '../data/content'
import { useProgressStore } from '../stores/useProgressStore'
import { usePlayerStore } from '../stores/usePlayerStore'
import { Quiz } from '../components/Quiz'
import { generateQuizFromTranscript } from '../services/geminiService'

type Tab = 'video' | 'podcast' | 'quiz'

export function TopicViewer() {
    const { subjectId, topicId } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>('video')
    const [quizMode, setQuizMode] = useState(false)
    const [aiQuiz, setAiQuiz] = useState<any>(null)
    const [loadingQuiz, setLoadingQuiz] = useState(false)
    const [quizError, setQuizError] = useState<string | null>(null)

    const { markVideoWatched, watchedVideos } = useProgressStore()
    const { setTrack } = usePlayerStore()

    const subject = getSubject(subjectId || '')
    const topic = getTopic(subjectId || '', topicId || '')

    useEffect(() => {
        // Mark video as watched after 30 seconds
        if (topic?.video && activeTab === 'video') {
            const timer = setTimeout(() => {
                markVideoWatched(topic.video!.id)
            }, 30000) // 30 seconds
            return () => clearTimeout(timer)
        }
    }, [topic, activeTab, markVideoWatched])

    if (!subject || !topic) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-white/50">
                <p>Konu bulunamadı</p>
                <Link to="/subjects" className="btn-glow mt-4">Derslere Dön</Link>
            </div>
        )
    }

    const youtubeId = topic.video ? getYouTubeVideoId(topic.video.youtubeUrl) : null
    const isWatched = watchedVideos.includes(topic.video?.id || '')

    const handlePlayPodcast = () => {
        if (topic.podcast) {
            setTrack({
                id: topic.podcast.id,
                title: topic.podcast.title,
                subject: subject.title,
                audioUrl: topic.podcast.audioUrl
            })
        }
    }

    const handleGenerateAIQuiz = async () => {
        if (!youtubeId) return

        setLoadingQuiz(true)
        setQuizError(null)

        try {
            const quiz = await generateQuizFromTranscript(youtubeId, topic.title, topic.keywords || [])
            setAiQuiz(quiz)
            setQuizMode(true)
        } catch (error: any) {
            setQuizError(error.message || 'Quiz oluşturulamadı')
        } finally {
            setLoadingQuiz(false)
        }
    }

    const handleStartManualQuiz = () => {
        setAiQuiz(null)
        setQuizMode(true)
    }

    if (quizMode) {
        const quizData = aiQuiz || topic.quiz
        if (!quizData) return null

        return (
            <Quiz
                quiz={quizData}
                onClose={() => setQuizMode(false)}
                subjectTitle={subject.title}
            />
        )
    }

    return (
        <div className="space-y-4 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/50">{subject.title}</p>
                    <h1 className="text-xl font-bold truncate">{topic.title}</h1>
                </div>
                {isWatched && (
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full text-sm">
                        <CheckCircle size={14} />
                        <span>İzlendi</span>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {topic.video && (
                    <button
                        onClick={() => setActiveTab('video')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'video'
                                ? 'bg-gradient-to-r from-violet-500 to-pink-500'
                                : 'glass-card hover:bg-white/10'
                            }`}
                    >
                        <Play size={16} />
                        <span>Video</span>
                    </button>
                )}
                {topic.podcast && (
                    <button
                        onClick={() => setActiveTab('podcast')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'podcast'
                                ? 'bg-gradient-to-r from-violet-500 to-pink-500'
                                : 'glass-card hover:bg-white/10'
                            }`}
                    >
                        <Headphones size={16} />
                        <span>Podcast</span>
                    </button>
                )}
                {(topic.quiz || topic.keywords) && (
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'quiz'
                                ? 'bg-gradient-to-r from-violet-500 to-pink-500'
                                : 'glass-card hover:bg-white/10'
                            }`}
                    >
                        <FileQuestion size={16} />
                        <span>Test</span>
                    </button>
                )}
            </div>

            {/* Video Tab */}
            {activeTab === 'video' && topic.video && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    {/* YouTube Embed */}
                    {youtubeId ? (
                        <div className="aspect-video rounded-xl overflow-hidden glass-card">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title={topic.video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video rounded-xl glass-card flex items-center justify-center">
                            <p className="text-white/50">Video yüklenemedi</p>
                        </div>
                    )}

                    <div className="glass-card p-4">
                        <h2 className="font-semibold mb-2">{topic.video.title}</h2>
                        {topic.description && (
                            <p className="text-sm text-white/60">{topic.description}</p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {(topic.quiz || topic.keywords) && (
                        <div className="flex gap-3">
                            {topic.quiz && (
                                <button
                                    onClick={handleStartManualQuiz}
                                    className="btn-glow flex-1 flex items-center justify-center gap-2"
                                >
                                    <FileQuestion size={18} />
                                    Test Çöz
                                </button>
                            )}
                            {topic.keywords && youtubeId && (
                                <button
                                    onClick={handleGenerateAIQuiz}
                                    disabled={loadingQuiz}
                                    className="btn-glow flex-1 flex items-center justify-center gap-2 !from-cyan-500 !to-blue-500"
                                >
                                    {loadingQuiz ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Sparkles size={18} />
                                    )}
                                    AI Test Oluştur
                                </button>
                            )}
                        </div>
                    )}

                    {quizError && (
                        <div className="glass-card p-3 border-red-500/50 text-red-400 text-sm">
                            {quizError}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Podcast Tab */}
            {activeTab === 'podcast' && topic.podcast && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-6 text-center"
                >
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mb-4">
                        <Headphones size={40} />
                    </div>
                    <h2 className="font-semibold text-lg mb-2">{topic.podcast.title}</h2>
                    <p className="text-sm text-white/50 mb-4">
                        {topic.podcast.duration || 'NotebookLM Podcast'}
                    </p>
                    <button
                        onClick={handlePlayPodcast}
                        className="btn-glow"
                    >
                        <Play size={18} className="inline mr-2" />
                        Dinlemeye Başla
                    </button>
                </motion.div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    {topic.quiz && (
                        <div className="glass-card p-4">
                            <h3 className="font-semibold mb-2">📝 Hazır Test</h3>
                            <p className="text-sm text-white/60 mb-4">
                                Bu konu için hazırlanmış {topic.quiz.questions.length} soruluk test
                            </p>
                            <button
                                onClick={handleStartManualQuiz}
                                className="btn-glow w-full"
                            >
                                Teste Başla
                            </button>
                        </div>
                    )}

                    {topic.keywords && youtubeId && (
                        <div className="glass-card p-4">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Sparkles size={18} className="text-cyan-400" />
                                AI ile Test Oluştur
                            </h3>
                            <p className="text-sm text-white/60 mb-4">
                                Video içeriğine göre Gemini AI tarafından özel sorular oluşturulur
                            </p>
                            <button
                                onClick={handleGenerateAIQuiz}
                                disabled={loadingQuiz}
                                className="btn-glow w-full !from-cyan-500 !to-blue-500 flex items-center justify-center gap-2"
                            >
                                {loadingQuiz ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        AI Test Oluştur
                                    </>
                                )}
                            </button>
                            {quizError && (
                                <p className="text-red-400 text-sm mt-2">{quizError}</p>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Notes (if any) */}
            {topic.notes && (
                <div className="glass-card p-4">
                    <h3 className="font-semibold mb-2">📒 Notlar</h3>
                    <div className="text-sm text-white/70 whitespace-pre-wrap">
                        {topic.notes}
                    </div>
                </div>
            )}
        </div>
    )
}
