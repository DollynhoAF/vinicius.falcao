import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

const langOptions = [
    { label: 'PT', value: 'pt-br' },
    { label: 'EN', value: 'en' },
]

const PillSwitch = () => {
    const { lang, setLang } = useLang()
    return (
        <div className="inline-flex items-center gap-[3px] bg-[#E6E7E9] border border-[#D2D4D7] rounded-full p-[3px]">
            {langOptions.map((opt) => {
                const isActive = lang === opt.value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setLang(opt.value as 'pt-br' | 'en')}
                        className={`rounded-full px-[14px] py-[4px] transition-colors duration-200 cursor-pointer ${isActive ? 'bg-white' : 'bg-transparent hover:bg-white/60'
                            }`}
                    >
                        <span className={`font-semibold text-[12px] tracking-[0.192px] uppercase leading-[1.4] whitespace-nowrap transition-colors duration-200 ${isActive ? 'text-[#0d7a6b]' : 'text-[#4D5560]'
                            }`}>
                            {opt.label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

const Navbar = () => {
    const { lang } = useLang()

    const navLinks = lang === 'pt-br'
        ? ['Cases', 'Sobre', 'Currículo']
        : ['Case Studies', 'About', 'Resume']

    return (
        <nav className="fixed top-0 left-0 w-full z-20 bg-white/80 backdrop-blur-sm">
            <div className="max-container px-6 md:px-20 py-[12px] flex items-center justify-between">

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <span className="text-xl font-bold tracking-tightest">
                        Vinícius Falcão
                    </span>
                    <PillSwitch />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-8 items-center"
                >
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            className="text-[#666666] hover:text-[#050505] transition-colors text-sm font-medium"
                        >
                            {item}
                        </a>
                    ))}
                </motion.div>

            </div>
        </nav>
    )
}

export default Navbar
