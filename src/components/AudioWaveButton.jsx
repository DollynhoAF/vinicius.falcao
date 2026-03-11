import { m, useReducedMotion, AnimatePresence } from "framer-motion";

// ─── AudioWaveButton ────────────────────────────────────────────────────────
// Replica exata do componente no Figma (node 28:22):
//   [ícone play circular] [pill com waveform estático/animado]
// Props:
//   playing  — bool, se o áudio está tocando
//   onToggle — callback para toggle play/pause
//   lang     — "pt-br" | "en-us" para label de acessibilidade

const sSnap = { type: "spring", stiffness: 340, damping: 28 };

// Alturas das 15 barras do waveform — extraídas do Figma (node 28:28)
const BAR_HEIGHTS = [4, 4, 10, 20, 10, 29, 29, 20, 10, 10, 29, 20, 4, 4, 4];

export default function AudioWaveButton({ playing, onToggle, lang = "pt-br" }) {
    const reduced = useReducedMotion();
    const label = lang === "pt-br"
        ? (playing ? "Pausar apresentação em áudio" : "Ouvir apresentação em áudio")
        : (playing ? "Pause audio presentation" : "Listen to audio presentation");

    return (
        <div className="flex items-center gap-[8px]">

            {/* ── Botão play/pause circular ── */}
            <m.button
                onClick={onToggle}
                aria-label={label}
                whileHover={reduced ? {} : { scale: 1.08 }}
                whileTap={reduced ? {} : { scale: 0.91 }}
                transition={sSnap}
                className="flex items-center justify-center bg-[#E6E7E9] rounded-full p-[8px] shrink-0 cursor-pointer"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {playing ? (
                        <m.svg
                            key="pause"
                            width="24" height="24" viewBox="0 0 24 24" fill="#4D5560"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <rect x="5" y="4" width="4" height="16" rx="1.5" />
                            <rect x="15" y="4" width="4" height="16" rx="1.5" />
                        </m.svg>
                    ) : (
                        <m.svg
                            key="play"
                            width="24" height="24" viewBox="0 0 24 24" fill="#4D5560"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <path d="M6.5 4.5a.75.75 0 0 1 1.14-.64l11 6.75a.75.75 0 0 1 0 1.28l-11 6.75A.75.75 0 0 1 6.5 18V4.5Z" />
                        </m.svg>
                    )}
                </AnimatePresence>
            </m.button>

            {/* ── Pill com waveform ── */}
            <div className="bg-[#E6E7E9] border border-[#D2D4D7] rounded-[9999px] p-[4px]">
                <div className="flex items-center gap-[4px] px-[16px]">
                    {BAR_HEIGHTS.map((h, i) => (
                        <m.div
                            key={i}
                            className="bg-[#757575] rounded-[2px] w-[4px]"
                            style={{ height: h }}
                            animate={playing && !reduced ? {
                                scaleY: [1, 1.8, 0.5, 1.4, 1],
                                opacity: [0.6, 1, 0.7, 1, 0.8],
                            } : { scaleY: 1, opacity: 1 }}
                            transition={playing && !reduced ? {
                                duration: 0.9 + (i % 3) * 0.2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: i * 0.06,
                            } : { duration: 0.2 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
