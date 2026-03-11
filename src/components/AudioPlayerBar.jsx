import { useRef, useEffect, useState, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── AudioPlayerBar ──────────────────────────────────────────────────────────
// Navbar inferior estilo Spotify — visual claro, textos em inglês.
// Aparece após o primeiro play. Fecha com o botão X (pausa + reseta estado).
// Ao dar play novamente no header, reaparece.

const sSnap = { type: "spring", stiffness: 340, damping: 28 };

const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
};

// ─── Hook de áudio centralizado ──────────────────────────────────────────────
export function useAudioPlayer(src) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = new Audio(src);
        audio.preload = "metadata";
        audioRef.current = audio;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };
        const onLoaded = () => setDuration(audio.duration);
        const onEnded = () => {
            setPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            audio.currentTime = 0;
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.pause();
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("ended", onEnded);
        };
    }, [src]);

    // Play / Pause — seta hasStarted na primeira vez que tocar
    const toggle = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            audio.play();
            setPlaying(true);
            setHasStarted(true);
        }
    }, [playing]);

    // Dismiss — pausa o áudio e esconde a barra; ao tocar de novo, reaparece
    const dismiss = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        setPlaying(false);
        setHasStarted(false);
    }, []);

    const seek = useCallback((ratio) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        audio.currentTime = ratio * audio.duration;
        setProgress(ratio * 100);
    }, []);

    return { playing, hasStarted, toggle, dismiss, progress, currentTime, duration, seek };
}

// ─── Barra inferior ──────────────────────────────────────────────────────────
export default function AudioPlayerBar({
    visible,
    playing,
    onToggle,
    onDismiss,
    progress,
    currentTime,
    duration,
    onSeek,
}) {
    const reduced = useReducedMotion();

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        onSeek(ratio);
    };

    return (
        <AnimatePresence>
            {visible && (
                <m.div
                    key="audio-bar"
                    className="fixed bottom-0 left-0 right-0 z-50"
                    initial={reduced ? false : { y: 88, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 88, opacity: 0 }}
                    transition={sSnap}
                >
                    <div className="bg-white border-t border-[#E6E7E9] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 md:px-8 py-3">
                        <div className="max-w-6xl mx-auto flex flex-col gap-3">

                            {/* ── Linha principal ── */}
                            <div className="flex items-center gap-4 md:gap-5">

                                {/* Play / Pause */}
                                <m.button
                                    onClick={onToggle}
                                    aria-label={playing ? "Pause" : "Play"}
                                    whileHover={reduced ? {} : { scale: 1.07 }}
                                    whileTap={reduced ? {} : { scale: 0.92 }}
                                    transition={sSnap}
                                    className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FA2F93] flex items-center justify-center shadow-sm cursor-pointer"
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {playing ? (
                                            <m.svg key="pause" width="16" height="16" viewBox="0 0 24 24" fill="white"
                                                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.12 }}>
                                                <rect x="5" y="4" width="4" height="16" rx="1.5" />
                                                <rect x="15" y="4" width="4" height="16" rx="1.5" />
                                            </m.svg>
                                        ) : (
                                            <m.svg key="play" width="16" height="16" viewBox="0 0 24 24" fill="white"
                                                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.12 }}>
                                                <path d="M6.5 4.5a.75.75 0 0 1 1.14-.64l11 6.75a.75.75 0 0 1 0 1.28l-11 6.75A.75.75 0 0 1 6.5 18V4.5Z" />
                                            </m.svg>
                                        )}
                                    </AnimatePresence>
                                </m.button>

                                {/* Tempo + barra de progresso */}
                                <div className="flex flex-1 items-center gap-3 min-w-0">
                                    <span className="text-xs text-[#8C939D] tabular-nums font-mono flex-shrink-0 w-8 text-right">
                                        {fmt(currentTime)}
                                    </span>

                                    <div
                                        role="progressbar"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={Math.round(progress)}
                                        aria-label="Audio progress"
                                        onClick={handleSeek}
                                        className="relative flex-1 h-1 rounded-full bg-[#E6E7E9] cursor-pointer group"
                                    >
                                        <m.div
                                            className="absolute left-0 top-0 h-full rounded-full bg-[#FA2F93]"
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.1, ease: "linear" }}
                                        />
                                        <m.div
                                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FA2F93] opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                            style={{ left: `calc(${progress}% - 6px)` }}
                                        />
                                        <div className="absolute inset-x-0 -top-3 -bottom-3" />
                                    </div>

                                    <span className="text-xs text-[#8C939D] tabular-nums font-mono flex-shrink-0 w-8">
                                        {fmt(duration)}
                                    </span>
                                </div>

                                {/* Waveform animado — só desktop */}
                                <div className="hidden md:flex items-center gap-[3px] h-5 flex-shrink-0">
                                    {[4, 8, 16, 20, 16, 8, 4, 8, 20, 16, 8, 4, 8, 16, 20].map((h, i) => (
                                        <m.div
                                            key={i}
                                            className="rounded-[2px] w-[3px]"
                                            style={{ height: h * 0.75, background: playing ? "#FA2F93" : "#D2D4D7" }}
                                            animate={playing && !reduced ? { scaleY: [1, 1.9, 0.4, 1.5, 1] } : { scaleY: 1 }}
                                            transition={playing && !reduced ? {
                                                duration: 0.85 + (i % 3) * 0.2,
                                                repeat: Infinity,
                                                repeatType: "mirror",
                                                ease: "easeInOut",
                                                delay: i * 0.06,
                                            } : { duration: 0.3 }}
                                        />
                                    ))}
                                </div>

                                {/* ── Botão fechar (X) ── */}
                                <m.button
                                    onClick={onDismiss}
                                    aria-label="Close audio player"
                                    whileHover={reduced ? {} : { scale: 1.12, backgroundColor: "#F3F4F6" }}
                                    whileTap={reduced ? {} : { scale: 0.9 }}
                                    transition={sSnap}
                                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#8C939D] hover:text-[#19202B] transition-colors cursor-pointer ml-1"
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <line x1="1" y1="1" x2="13" y2="13" />
                                        <line x1="13" y1="1" x2="1" y2="13" />
                                    </svg>
                                </m.button>

                            </div>
                        </div>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
