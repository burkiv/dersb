import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Key, Trash2, Save, CheckCircle } from 'lucide-react'

export function Settings() {
    const [apiKey, setApiKey] = useState('')
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini-api-key')
        if (storedKey) {
            setApiKey(storedKey)
        }
    }, [])

    const handleSave = () => {
        localStorage.setItem('gemini-api-key', apiKey)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleClearProgress = () => {
        if (confirm('Tüm ilerleme verileri silinecek. Emin misiniz?')) {
            localStorage.removeItem('kpss-progress')
            localStorage.removeItem('kpss-player')
            window.location.reload()
        }
    }

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-bold">⚙️ Ayarlar</h1>

            {/* Gemini API Key */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <Key size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold">Gemini API Key</h2>
                        <p className="text-sm text-white/50">AI test oluşturma için gerekli</p>
                    </div>
                </div>

                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIza... şeklinde API key'inizi girin"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none transition-colors mb-3"
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="btn-glow flex items-center gap-2"
                    >
                        {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                        {saved ? 'Kaydedildi!' : 'Kaydet'}
                    </button>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm"
                    >
                        API Key Al (Ücretsiz)
                    </a>
                </div>
            </motion.div>

            {/* Clear Progress */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <Trash2 size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold">İlerlemeyi Sıfırla</h2>
                        <p className="text-sm text-white/50">Tüm izleme ve test verilerini sil</p>
                    </div>
                </div>

                <button
                    onClick={handleClearProgress}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                    Verileri Sil
                </button>
            </motion.div>

            {/* About */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-4 text-center"
            >
                <p className="text-2xl mb-2">📚</p>
                <p className="font-semibold">KPSS Study App</p>
                <p className="text-sm text-white/50">Kardeşin için özel hazırlandı ❤️</p>
                <p className="text-xs text-white/30 mt-2">v1.0.0</p>
            </motion.div>
        </div>
    )
}
