import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, Settings, Menu, X } from 'lucide-react'
import { AudioPlayer } from '../AudioPlayer'
import { usePlayerStore } from '../../stores/usePlayerStore'

const navItems = [
    { icon: Home, label: 'Ana Sayfa', path: '/' },
    { icon: BookOpen, label: 'Dersler', path: '/subjects' },
    { icon: Settings, label: 'Ayarlar', path: '/settings' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { currentTrack } = usePlayerStore()

    return (
        <div className="min-h-screen flex">
            {/* Desktop Sidebar */}
            <aside className="hide-mobile fixed left-0 top-0 bottom-0 w-64 p-4 z-40">
                <div className="glass-card h-full p-4 flex flex-col">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg font-bold">
                            K
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">KPSS Study</h1>
                            <p className="text-xs text-[rgb(var(--text-muted))]">2026 Hazırlık</p>
                        </div>
                    </Link>

                    {/* Nav Items */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white border border-violet-500/30'
                                        : 'text-[rgb(var(--text-secondary))] hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-[rgb(var(--text-muted))] text-center">
                            Made with 💜 for KPSS
                        </p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="hide-desktop fixed top-0 left-0 right-0 z-50 glass-card-subtle safe-top">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                            K
                        </div>
                        <span className="font-bold">KPSS Study</span>
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/10"
                        >
                            <nav className="p-2 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white'
                                                : 'text-[rgb(var(--text-secondary))] hover:bg-white/5'
                                                }`}
                                        >
                                            <item.icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className="flex-1 md:ml-64">
                <div className="max-w-4xl mx-auto px-4 py-6 pt-20 md:pt-6">
                    {children}
                </div>
            </main>

            {/* Audio Player */}
            {currentTrack && (
                <div className="fixed bottom-0 left-0 right-0 md:left-64 z-50">
                    <AudioPlayer />
                </div>
            )}

            {/* Mobile Bottom Nav */}
            <nav className="hide-desktop fixed bottom-0 left-0 right-0 z-40 safe-bottom">
                {!currentTrack && (
                    <div className="glass-card-subtle border-t border-white/10">
                        <div className="flex justify-around py-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${isActive
                                            ? 'text-[rgb(var(--primary-light))]'
                                            : 'text-[rgb(var(--text-muted))]'
                                            }`}
                                    >
                                        <item.icon size={22} />
                                        <span className="text-xs mt-1">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    )
}
