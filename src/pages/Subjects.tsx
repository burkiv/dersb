import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, Headphones, FileText, ChevronRight } from 'lucide-react'
import { courseData } from '../data/schema'
import { useProgressStore } from '../stores/useProgressStore'

export function Subjects() {
    const { watchedVideos } = useProgressStore()

    return (
        <div className="space-y-6 pb-24">
            <div>
                <h1 className="text-2xl font-bold mb-2">Dersler</h1>
                <p className="text-[rgb(var(--text-secondary))]">
                    KPSS için tüm ders içerikleri
                </p>
            </div>

            <div className="space-y-4">
                {courseData.courses.map((course, index) => {
                    const videoCount = course.instructors.reduce((a, i) => a + i.videos.length, 0)
                    const watchedCount = course.instructors.reduce((acc, inst) =>
                        acc + inst.videos.filter(v => watchedVideos.includes(v.id)).length, 0)
                    const progress = videoCount > 0 ? Math.round((watchedCount / videoCount) * 100) : 0
                    const hasContent = videoCount > 0 || course.podcasts.length > 0 || course.notes.length > 0 || course.quizzes.length > 0

                    return (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                to={`/course/${course.id}`}
                                className="glass-card p-5 flex items-center gap-4 block"
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                                    {course.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg mb-1">{course.name}</h3>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-3 text-xs text-[rgb(var(--text-muted))]">
                                        {videoCount > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Play size={12} /> {videoCount} video
                                            </span>
                                        )}
                                        {course.podcasts.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Headphones size={12} /> {course.podcasts.length} podcast
                                            </span>
                                        )}
                                        {course.notes.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <FileText size={12} /> {course.notes.length} not
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress */}
                                    {videoCount > 0 && (
                                        <div className="mt-3">
                                            <div className="flex justify-between items-center text-xs mb-1">
                                                <span className="text-[rgb(var(--text-muted))]">İlerleme</span>
                                                <span className="text-[rgb(var(--primary-light))]">%{progress}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {!hasContent && (
                                        <p className="text-xs text-[rgb(var(--text-muted))] mt-2 italic">
                                            İçerik eklenmeyi bekliyor...
                                        </p>
                                    )}
                                </div>

                                <ChevronRight size={20} className="text-[rgb(var(--text-muted))] shrink-0" />
                            </Link>
                        </motion.div>
                    )
                })}
            </div>

            {/* Help Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card-subtle p-4 text-center"
            >
                <p className="text-sm text-[rgb(var(--text-muted))]">
                    💡 <strong>İpucu:</strong> Playlist eklemek için terminal'de{' '}
                    <code className="text-[rgb(var(--primary-light))]">node scripts/fetch-playlist.mjs</code> çalıştır
                </p>
            </motion.div>
        </div>
    )
}
