import { motion, useAnimationFrame, useMotionValue, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLang } from '../context/LangContext'

const SPEED_DEFAULT = 60
const SPEED_HOVER = 20

const badgesPT = [
    '7 anos de UX Design',
    '+12 produtos desenvolvidos',
    'Design System',
    '+200 Landing Pages',
    '3 Apps na App Store',
    '2 SaaS Platforms',
    '3 ERPs',
    'Lead Design',
    'DesignOps',
    'UX Researcher',
    'User Tester',
    'Figma Expert',
    'Design com IA',
    'Claude Code',
    'Antigravity',
    'Lovable',
    'Vertex by Google',
    'Motion com IA',
    'Ilustração',
]

const badgesEN = [
    '7 years of UX Design',
    '+12 products built',
    'Design System',
    '+200 Landing Pages',
    '3 Apps on App Store',
    '2 SaaS Platforms',
    '3 ERPs',
    'Lead Design',
    'DesignOps',
    'UX Researcher',
    'User Tester',
    'Figma Expert',
    'AI-assisted Design',
    'Claude Code',
    'Antigravity',
    'Lovable',
    'Vertex by Google',
    'Motion AI-assisted',
    'Illustration',
]

const copy = {
    'pt-br': {
        tagline: 'Product Designer · Design Systems · DesignOps · IA aplicada',
        bio: 'Product Designer com 7+ anos de experiência, liderando Design, escalando Design Systems, produtos digitais e operações de design com suporte de IA para acelerar entregas com consistência.',
    },
    en: {
        tagline: 'Product Designer · Design Systems · DesignOps · AI-assisted',
        bio: 'Product Designer with 7+ years of experience, leading Design and scaling Design Systems and design operations with AI support to accelerate delivery with consistency.',
    },
}

const Marquee = ({ badges }: { badges: string[] }) => {
    const trackRef = useRef<HTMLDivElement>(null)
    const xPos = useRef(0)
    const [hovered, setHovered] = useState(false)
    const x = useMotionValue(0)

    useAnimationFrame((_, delta) => {
        const speed = hovered ? SPEED_HOVER : SPEED_DEFAULT
        const track = trackRef.current
        if (!track) return

        const halfW = track.scrollWidth / 2
        xPos.current -= (speed * delta) / 1000
        if (Math.abs(xPos.current) >= halfW) {
            xPos.current += halfW
        }
        x.set(xPos.current)
    })

    return (
        <div
            className="marquee-wrapper -mx-6 md:-mx-20"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.div
                ref={trackRef}
                className="marquee-track gap-3 py-1"
                style={{ x }}
            >
                {[...badges, ...badges].map((badge, i) => (
                    <span
                        key={i}
                        className="inline-flex shrink-0 items-center px-5 py-2 rounded-full border border-[#0d7a6b] text-[#0d7a6b] text-sm font-medium whitespace-nowrap"
                    >
                        {badge}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

const Hero = () => {
    const { lang } = useLang()
    const t = copy[lang]
    const badges = lang === 'pt-br' ? badgesPT : badgesEN

    return (
        <section className="pt-48 pb-[32px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="mb-6">
                    <img
                        src="/images/profilepic.jpg"
                        alt="Vinícius Falcão"
                        className="w-40 h-40 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-sm"
                    />
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tightest leading-[1.1] mb-4">
                    Vinícius Falcão
                </h1>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={lang + '-tagline'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="text-lg md:text-xl font-medium text-[#0d7a6b] mb-8 tracking-tight"
                    >
                        {t.tagline}
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={lang + '-bio'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="text-xl md:text-2xl text-[#666666] max-w-3xl leading-relaxed mb-12"
                    >
                        {t.bio}
                    </motion.p>
                </AnimatePresence>

                <Marquee badges={badges} />
            </motion.div>
        </section>
    )
}

export default Hero
