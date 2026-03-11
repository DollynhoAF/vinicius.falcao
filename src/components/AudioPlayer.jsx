import { useState, useRef, useEffect } from "react";
import { m, useReducedMotion } from "framer-motion";

// ─── AudioPlayer — componente de play de áudio para o Housi Drive ──────────
// Props:
//   src: caminho do arquivo (ex: "/audio/housi-drive.wav")
//   title: nome exibido no player (ex: "Ouça o case")
//   subtitle: descrição curta opcional

const sSnap = { type: "spring", stiffness: 320, damping: 26 };

export default function AudioPlayer({ src, title = "Ouça o case", subtitle }) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);        // 0–100
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    const reduced = useReducedMotion();

    // Sincroniza progresso enquanto toca
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

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
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("ended", onEnded);
        };
    }, []);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
        } else {
            audio.play();
        }
        setPlaying(!playing);
    };

    // Seek ao clicar na barra de progresso
    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * duration;
        setProgress(ratio * 100);
    };

    const fmt = (s) => {
        if (!s || isNaN(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <m.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...sSnap, delay: 0.1 }}
            viewport={{ once: true, margin: "-60px" }}
            className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-4"
        >
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Linha superior: botão + info */}
            <div className="flex items-center gap-4">
                {/* Botão Play/Pause */}
                <m.button
                    onClick={toggle}
                    whileHover={reduced ? {} : { scale: 1.08 }}
                    whileTap={reduced ? {} : { scale: 0.93 }}
                    transition={sSnap}
                    aria-label={playing ? "Pausar" : "Tocar"}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                >
                    {playing ? (
                        /* Ícone Pause */
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="5" y="4" width="4" height="16" rx="1" />
                            <rect x="15" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        /* Ícone Play */
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 4.75a.75.75 0 0 1 1.14-.64l12 7.25a.75.75 0 0 1 0 1.28l-12 7.25A.75.75 0 0 1 6 19.25v-14.5Z" />
                        </svg>
                    )}
                </m.button>

                {/* Título e subtítulo */}
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{title}</span>
                    {subtitle && (
                        <span className="text-xs text-white/50 truncate">{subtitle}</span>
                    )}
                </div>

                {/* Tempo */}
                <span className="ml-auto text-xs text-white/40 tabular-nums flex-shrink-0">
                    {fmt(currentTime)} / {fmt(duration)}
                </span>
            </div>

            {/* Barra de progresso clicável */}
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                onClick={handleSeek}
                className="relative h-1.5 w-full rounded-full bg-white/10 cursor-pointer group"
            >
                {/* Preenchimento animado */}
                <m.div
                    className="absolute left-0 top-0 h-full rounded-full bg-white"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                />
                {/* Thumb visível no hover */}
                <m.div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    style={{ left: `calc(${progress}% - 6px)` }}
                />
            </div>
        </m.div>
    );
}
