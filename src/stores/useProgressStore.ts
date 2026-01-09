import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
    watchedVideos: string[] // Array of video IDs
    completedQuizzes: Record<string, number> // Quiz ID -> Best Score
    streak: number
    lastStudyDate: string | null

    markVideoWatched: (videoId: string) => void
    saveQuizScore: (quizId: string, score: number) => void
    updateStreak: () => void
    getSubjectProgress: (subjectId: string, totalTopics: number) => number
}

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            watchedVideos: [],
            completedQuizzes: {},
            streak: 0,
            lastStudyDate: null,

            markVideoWatched: (videoId) => {
                const current = get().watchedVideos
                if (!current.includes(videoId)) {
                    set({ watchedVideos: [...current, videoId] })
                    get().updateStreak()
                }
            },

            saveQuizScore: (quizId, score) => {
                const current = get().completedQuizzes
                const existingScore = current[quizId] || 0
                if (score > existingScore) {
                    set({ completedQuizzes: { ...current, [quizId]: score } })
                }
                get().updateStreak()
            },

            updateStreak: () => {
                const today = new Date().toDateString()
                const lastDate = get().lastStudyDate

                if (lastDate === today) return // Already studied today

                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)

                if (lastDate === yesterday.toDateString()) {
                    // Consecutive day - increase streak
                    set({ streak: get().streak + 1, lastStudyDate: today })
                } else {
                    // Streak broken - reset to 1
                    set({ streak: 1, lastStudyDate: today })
                }
            },

            getSubjectProgress: (subjectId, totalTopics) => {
                const watched = get().watchedVideos.filter(id => id.startsWith(subjectId))
                return totalTopics > 0 ? Math.round((watched.length / totalTopics) * 100) : 0
            },
        }),
        {
            name: 'kpss-progress',
        }
    )
)
