import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

const copy = {
    'pt-br': {
        heading: 'Entre em contato',
        email: 'Email',
        linkedin: 'LinkedIn',
        resume: 'Currículo',
        copyright: '© 2025 Vinícius Falcão. Todos os direitos reservados.',
    },
    en: {
        heading: 'Get in touch',
        email: 'Email',
        linkedin: 'LinkedIn',
        resume: 'Resume',
        copyright: '© 2025 Vinícius Falcão. All rights reserved.',
    },
}

// Ícone de envelope
const IconEmail = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)

// Ícone do LinkedIn
const IconLinkedIn = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
)

// Ícone de download
const IconDownload = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)

const Footer = () => {
    const { lang } = useLang()
    const t = copy[lang] ?? copy['pt-br']

    return (
        <footer id="resume" className="pt-20 pb-32 md:pt-32 md:pb-48 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl md:text-6xl font-bold tracking-tightest mb-16 text-[#050505]">
                    {t.heading}
                </h2>

                {/* Três botões estilo da referência mas com visual branco/claro */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

                    {/* Email — verde do site, texto branco */}
                    <motion.a
                        href="mailto:viniciusanselmo002@gmail.com"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#0d7a6b] text-white rounded-2xl font-semibold text-base transition-shadow hover:shadow-xl hover:shadow-[#0d7a6b33] cursor-pointer"
                    >
                        <IconEmail />
                        {t.email}
                    </motion.a>

                    {/* LinkedIn — default cinza/preto, hover verde */}
                    <motion.a
                        href="https://www.linkedin.com/in/vinicius-falcao/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-[#e0e0e0] text-[#050505] rounded-2xl font-semibold text-base transition-all hover:border-[#0d7a6b] hover:text-[#0d7a6b] hover:shadow-md cursor-pointer"
                    >
                        <IconLinkedIn />
                        {t.linkedin}
                    </motion.a>

                    {/* Currículo / Resume — default cinza/preto, hover verde */}
                    <motion.a
                        href="/curriculo.pdf"
                        download="CV-ViniciusFalcao.pdf"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-[#e0e0e0] text-[#050505] rounded-2xl font-semibold text-base transition-all hover:border-[#0d7a6b] hover:text-[#0d7a6b] hover:shadow-md cursor-pointer"
                    >
                        <IconDownload />
                        {t.resume}
                    </motion.a>

                </div>

                {/* Rodapé inferior */}
                <div className="mt-32 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[#666666] text-sm">
                    <p>{t.copyright}</p>
                </div>

            </motion.div>
        </footer>
    )
}

export default Footer
