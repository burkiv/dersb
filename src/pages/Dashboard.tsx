import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, BookOpen, Headphones, FileText, Award, Flame, ChevronRight } from 'lucide-react'
import { courseData } from '../data/schema'
import { useProgressStore } from '../stores/useProgressStore'

export function Dashboard() {
    const { watchedVideos, streak } = useProgressStore()

    // Calculate total stats
    const totalVideos = courseData.courses.reduce((acc, course) =>
        acc + course.instructors.reduce((a, i) => a + i.videos.length, 0), 0)
    const totalPodcasts = courseData.courses.reduce((acc, c) => acc + c.podcasts.length, 0)
    const totalNotes = courseData.courses.reduce((acc, c) => acc + c.notes.length, 0)

    const stats = [
        {
            icon: Flame,
            color: 'from-orange-500 to-red-500',
            value: streak,
            label: 'Günlük Seri'
        },
        {
            icon: Play,
            color: 'from-violet-500 to-purple-600',
            value: `${watchedVideos.length}/${totalVideos}`,
            label: 'Video İzlendi'
        },
        {
            icon: Headphones,
            color: 'from-cyan-500 to-blue-500',
            value: totalPodcasts,
            label: 'Podcast'
        },
        {
            icon: FileText,
            color: 'from-emerald-500 to-green-600',
            value: totalNotes,
            label: 'PDF Not'
        },
    ]

    return (
        <div className="space-y-6 pb-24">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h1 className="text-2xl font-bold mb-2">
                    Merhaba! 👋
                </h1>
                <p className="text-[rgb(var(--text-secondary))]">
                    KPSS'ye hazırlanmaya devam et. Bugün hangi konuyu çalışmak istersin?
                </p>

                <Link to="/subjects" className="btn-glow mt-4 inline-flex">
                    <Play size={18} />
                    Derse Başla
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="stat-card"
                    >
                        <div className={`icon bg-gradient-to-br ${stat.color}`}>
                            <stat.icon size={20} className="text-white" />
                        </div>
                        <div className="value">{stat.value}</div>
                        <div className="label">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Courses Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Dersler</h2>
                    <Link to="/subjects" className="text-sm text-[rgb(var(--primary-light))] hover:underline flex items-center gap-1">
                        Tümünü Gör <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {courseData.courses.map((course, index) => {
                        const videoCount = course.instructors.reduce((a, i) => a + i.videos.length, 0)
                        const watchedCount = course.instructors.reduce((acc, inst) =>
                            acc + inst.videos.filter(v => watchedVideos.includes(v.id)).length, 0)
                        const progress = videoCount > 0 ? Math.round((watchedCount / videoCount) * 100) : 0

                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/course/${course.id}`} className="course-card">
                                    <div className={`icon-wrapper bg-gradient-to-br ${course.color}`}>
                                        {course.icon}
                                    </div>
                                    <h3 className="font-semibold mb-1">{course.name}</h3>
                                    <p className="text-xs text-[rgb(var(--text-muted))] mb-3">
                                        {videoCount > 0 ? `${videoCount} video` : 'Henüz içerik yok'}
                                    </p>
                                    {videoCount > 0 && (
                                        <>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">%{progress} tamamlandı</p>
                                        </>
                                    )}
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Quick Access */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Hızlı Erişim</h2>
                <div className="grid grid-cols-3 gap-3">
                    <Link to="/subjects" className="topic-card flex-col text-center !py-6">
                        <BookOpen size={24} className="text-violet-400 mb-2" />
                        <span className="text-sm font-medium">Dersler</span>
                    </Link>
                    <Link to="/subjects" className="topic-card flex-col text-center !py-6">
                        <Headphones size={24} className="text-cyan-400 mb-2" />
                        <span className="text-sm font-medium">Podcastler</span>
                    </Link>
                    <Link to="/subjects" className="topic-card flex-col text-center !py-6">
                        <Award size={24} className="text-amber-400 mb-2" />
                        <span className="text-sm font-medium">Testler</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
