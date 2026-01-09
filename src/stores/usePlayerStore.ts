import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Track {
    id: string
    title: string
    artist?: string
    subject?: string
    audioUrl: string
}

interface PlayerState {
    currentTrack: Track | null
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    setTrack: (track: Track | null) => void
    setIsPlaying: (isPlaying: boolean) => void
    play: () => void
    pause: () => void
    toggle: () => void
    setCurrentTime: (time: number) => void
    setDuration: (duration: number) => void
    setVolume: (volume: number) => void
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 0.8,

            setTrack: (track) => set({ currentTrack: track, currentTime: 0, isPlaying: track ? true : false }),
            setIsPlaying: (isPlaying) => set({ isPlaying }),
            play: () => set({ isPlaying: true }),
            pause: () => set({ isPlaying: false }),
            toggle: () => set({ isPlaying: !get().isPlaying }),
            setCurrentTime: (time) => set({ currentTime: time }),
            setDuration: (duration) => set({ duration }),
            setVolume: (volume) => set({ volume }),
        }),
        {
            name: 'kpss-player',
            partialize: (state) => ({ volume: state.volume }), // Only persist volume preference
        }
    )
)
