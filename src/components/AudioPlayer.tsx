import { useRef, useEffect, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import { usePlayerStore } from '../stores/usePlayerStore'

export function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const {
        currentTrack,
        isPlaying,
        volume,
        setIsPlaying,
        setVolume,
        setTrack
    } = usePlayerStore()

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, currentTrack])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value)
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setCurrentTime(time)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds
        }
    }

    if (!currentTrack) return null

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={currentTrack.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-3">
                {/* Track Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{currentTrack.title}</p>
                    <p className="text-xs text-[rgb(var(--text-muted))] truncate">{currentTrack.artist}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => skip(-15)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <SkipBack size={18} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="play-btn"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>

                    <button
                        onClick={() => skip(15)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <SkipForward size={18} />
                    </button>
                </div>

                {/* Progress & Volume - Desktop */}
                <div className="hide-mobile flex items-center gap-4 flex-1 max-w-md">
                    <span className="text-xs text-[rgb(var(--text-muted))] w-10">
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1"
                    />
                    <span className="text-xs text-[rgb(var(--text-muted))] w-10">
                        {formatTime(duration)}
                    </span>

                    <button
                        onClick={() => setVolume(volume === 0 ? 1 : 0)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20"
                    />
                </div>

                {/* Close */}
                <button
                    onClick={() => { setIsPlaying(false); setTrack(null) }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-[rgb(var(--text-muted))]"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Mobile Progress */}
            <div className="hide-desktop mt-2">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-[rgb(var(--text-muted))] mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    )
}
