import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { getCourse, getInstructor } from '../data/schema'
import { useProgressStore } from '../stores/useProgressStore'

export function VideoPlayer() {
    const { courseId, instructorId, videoId } = useParams()
    const navigate = useNavigate()
    const { markVideoWatched, watchedVideos } = useProgressStore()

    const course = getCourse(courseId || '')
    const instructor = getInstructor(courseId || '', instructorId || '')
    const video = instructor?.videos.find(v => v.youtubeId === videoId)

    // Find prev/next videos
    const currentIndex = instructor?.videos.findIndex(v => v.youtubeId === videoId) ?? -1
    const prevVideo = currentIndex > 0 ? instructor?.videos[currentIndex - 1] : null
    const nextVideo = currentIndex < (instructor?.videos.length ?? 0) - 1 ? instructor?.videos[currentIndex + 1] : null

    const isWatched = watchedVideos.includes(video?.id || '')

    useEffect(() => {
        // Mark video as watched after 30 seconds
        if (video) {
            const timer = setTimeout(() => {
                markVideoWatched(video.id)
            }, 30000)
            return () => clearTimeout(timer)
        }
    }, [video, markVideoWatched])

    if (!course || !instructor || !video) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-white/50">
                <p>Video bulunamadı</p>
                <Link to="/subjects" className="btn-glow mt-4">Derslere Dön</Link>
            </div>
        )
    }

    return (
        <div className="space-y-4 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/50">{instructor.name}</p>
                    <h1 className="text-lg font-semibold truncate">{video.title}</h1>
                </div>
                {isWatched && (
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full text-xs">
                        <CheckCircle size={12} />
                        <span>İzlendi</span>
                    </div>
                )}
            </div>

            {/* YouTube Player */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="aspect-video rounded-xl overflow-hidden glass-card"
            >
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </motion.div>

            {/* Navigation */}
            <div className="flex gap-3">
                {prevVideo ? (
                    <Link
                        to={`/watch/${courseId}/${instructorId}/${prevVideo.youtubeId}`}
                        className="flex-1 glass-card p-3 flex items-center gap-2 hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={18} />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/50">Önceki</p>
                            <p className="text-sm truncate">{prevVideo.title}</p>
                        </div>
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}

                {nextVideo ? (
                    <Link
                        to={`/watch/${courseId}/${instructorId}/${nextVideo.youtubeId}`}
                        className="flex-1 glass-card p-3 flex items-center gap-2 hover:bg-white/10 transition-colors text-right"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/50">Sonraki</p>
                            <p className="text-sm truncate">{nextVideo.title}</p>
                        </div>
                        <ChevronRight size={18} />
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}
            </div>

            {/* Video Info */}
            <div className="glass-card p-4">
                <h2 className="font-semibold mb-2">{video.title}</h2>
                <div className="flex items-center gap-3 text-sm text-white/50">
                    <span>{course.name}</span>
                    <span>•</span>
                    <span>{instructor.name}</span>
                    {video.duration && (
                        <>
                            <span>•</span>
                            <span>{video.duration}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Progress */}
            <div className="glass-card p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">İlerleme</span>
                    <span className="text-sm text-white/50">
                        {currentIndex + 1} / {instructor.videos.length} video
                    </span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentIndex + 1) / instructor.videos.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Mark as watched button */}
            {!isWatched && (
                <button
                    onClick={() => markVideoWatched(video.id)}
                    className="btn-glow w-full"
                >
                    <CheckCircle size={18} className="inline mr-2" />
                    İzlendi Olarak İşaretle
                </button>
            )}
        </div>
    )
}
