import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowLeft, Trophy } from 'lucide-react'
import { useProgressStore } from '../stores/useProgressStore'

interface QuizQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation?: string
}

interface QuizProps {
    quiz: {
        id: string
        title: string
        questions: QuizQuestion[]
    }
    onClose: () => void
    subjectTitle: string
}

export function Quiz({ quiz, onClose, subjectTitle }: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [answers, setAnswers] = useState<number[]>([])
    const [finished, setFinished] = useState(false)

    const { saveQuizScore } = useProgressStore()

    const currentQuestion = quiz.questions[currentIndex]
    const isLastQuestion = currentIndex === quiz.questions.length - 1

    const handleSelect = (index: number) => {
        if (showResult) return
        setSelectedAnswer(index)
    }

    const handleConfirm = () => {
        if (selectedAnswer === null) return

        setShowResult(true)
        setAnswers([...answers, selectedAnswer])
    }

    const handleNext = () => {
        if (isLastQuestion) {
            // Calculate score
            const finalAnswers = [...answers]
            const correctCount = finalAnswers.reduce((acc, answer, idx) => {
                return acc + (answer === quiz.questions[idx].correctIndex ? 1 : 0)
            }, 0)
            const score = Math.round((correctCount / quiz.questions.length) * 100)
            saveQuizScore(quiz.id, score)
            setFinished(true)
        } else {
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        }
    }

    // Results Screen
    if (finished) {
        const correctCount = answers.reduce((acc, answer, idx) => {
            return acc + (answer === quiz.questions[idx].correctIndex ? 1 : 0)
        }, 0)
        const score = Math.round((correctCount / quiz.questions.length) * 100)

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 text-center"
            >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${score >= 70
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                        : score >= 50
                            ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                            : 'bg-gradient-to-br from-red-500 to-pink-600'
                    }`}>
                    <Trophy size={40} />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                    {score >= 70 ? 'Harika! 🎉' : score >= 50 ? 'İyi Gidiyorsun! 💪' : 'Tekrar Dene! 📚'}
                </h2>

                <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    %{score}
                </p>

                <p className="text-white/60 mb-6">
                    {correctCount} / {quiz.questions.length} doğru
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        Konuya Dön
                    </button>
                    <button
                        onClick={() => {
                            setCurrentIndex(0)
                            setSelectedAnswer(null)
                            setShowResult(false)
                            setAnswers([])
                            setFinished(false)
                        }}
                        className="btn-glow"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-4 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <p className="text-sm text-white/50">{subjectTitle}</p>
                    <h1 className="font-semibold">{quiz.title}</h1>
                </div>
                <div className="glass-card px-3 py-1 text-sm">
                    {currentIndex + 1} / {quiz.questions.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-4"
            >
                <p className="text-lg font-medium mb-4">{currentQuestion.question}</p>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === idx
                        const isCorrect = idx === currentQuestion.correctIndex

                        let bgClass = 'bg-white/5 hover:bg-white/10'
                        let borderClass = 'border-white/10'

                        if (showResult) {
                            if (isCorrect) {
                                bgClass = 'bg-emerald-500/20'
                                borderClass = 'border-emerald-500'
                            } else if (isSelected && !isCorrect) {
                                bgClass = 'bg-red-500/20'
                                borderClass = 'border-red-500'
                            }
                        } else if (isSelected) {
                            bgClass = 'bg-violet-500/20'
                            borderClass = 'border-violet-500'
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                disabled={showResult}
                                className={`w-full p-4 rounded-xl border-2 ${bgClass} ${borderClass} transition-all text-left flex items-center gap-3`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${showResult && isCorrect
                                        ? 'bg-emerald-500'
                                        : showResult && isSelected && !isCorrect
                                            ? 'bg-red-500'
                                            : isSelected
                                                ? 'bg-violet-500'
                                                : 'bg-white/10'
                                    }`}>
                                    {showResult && isCorrect ? (
                                        <CheckCircle size={16} />
                                    ) : showResult && isSelected && !isCorrect ? (
                                        <XCircle size={16} />
                                    ) : (
                                        <span className="text-sm font-medium">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                    )}
                                </div>
                                <span className="flex-1">{option}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Explanation */}
                {showResult && currentQuestion.explanation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                        <p className="text-sm text-white/70">
                            <strong>Açıklama:</strong> {currentQuestion.explanation}
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Action Button */}
            <div className="flex justify-end">
                {!showResult ? (
                    <button
                        onClick={handleConfirm}
                        disabled={selectedAnswer === null}
                        className={`btn-glow ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cevabı Kontrol Et
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="btn-glow"
                    >
                        {isLastQuestion ? 'Sonuçları Gör' : 'Sonraki Soru'}
                    </button>
                )}
            </div>
        </div>
    )
}
