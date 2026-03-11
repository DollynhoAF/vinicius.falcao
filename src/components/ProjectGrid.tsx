import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Project = {
    title: string
    category: string
    description: string
    image: string
    route?: string
    comingSoon?: boolean
}

const projects: Project[] = [
    {
        title: 'Housi Drive',
        category: 'PLATAFORMA B2B',
        description: 'Substituí WhatsApp, e-mail e Excel de uma proptech — 340 projetos gerenciados em um só lugar.',
        image: '/images/housi-drive/hero-mockup.webp',
        route: '/case/housi-drive',
    },
    {
        title: 'Em Breve',
        category: 'NOVO CASE',
        description: 'Mais um trabalho a caminho. Estou documentando o processo para compartilhar em breve.',
        image: '',
        comingSoon: true,
    },
]

const ComingSoonCard = ({ project, index }: { project: Project; index: number }) => (
    <motion.div
        key={project.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="cursor-default group"
    >
        {/* Placeholder visual */}
        <div className="aspect-[16/10] rounded-project mb-6 relative overflow-hidden"
            style={{ background: 'repeating-linear-gradient(135deg, #f0f0f0 0px, #f0f0f0 10px, #fafafa 10px, #fafafa 20px)' }}
        >
            {/* Subtle border */}
            <div className="absolute inset-0 border-2 border-dashed border-[#d4d4d4] rounded-project" />

            {/* Center badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="w-10 h-10 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </span>
                <span className="text-xs font-bold tracking-widest text-[#aaaaaa] uppercase">Em Breve</span>
            </div>
        </div>

        <span className="text-xs font-bold tracking-widest text-[#aaaaaa] uppercase mb-2 block">
            {project.category}
        </span>
        <h3 className="text-2xl font-bold mb-1 text-[#bbbbbb]">
            {project.title}
        </h3>
        <p className="text-[#aaaaaa] text-sm">
            {project.description}
        </p>
    </motion.div>
)

const ProjectGrid = () => {
    const navigate = useNavigate()

    return (
        <section id="case-studies" className="py-20 md:py-32">

            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-14"
            >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                    Meus Projetos
                </h2>
                <p className="text-[#666666] text-base max-w-lg">
                    Confira alguns trabalhos seletos que traduzem um pouco do meu dia a dia como designer.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {projects.map((project, index) =>
                    project.comingSoon ? (
                        <ComingSoonCard key={project.title} project={project} index={index} />
                    ) : (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`group ${project.route ? 'cursor-pointer' : 'cursor-default'}`}
                            onClick={() => project.route && navigate(project.route)}
                        >
                            <div className="aspect-[16/10] overflow-hidden rounded-project mb-6 bg-gray-100 relative">
                                <motion.img
                                    src={project.image}
                                    alt={project.title}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full h-full object-cover"
                                />
                                {project.route && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="bg-[#050505] text-white text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full shadow-lg">
                                            Ver Case →
                                        </span>
                                    </div>
                                )}
                            </div>

                            <span className="text-xs font-bold tracking-widest text-[#666666] uppercase mb-2 block">
                                {project.category}
                            </span>
                            <h3 className="text-2xl font-bold mb-1 group-hover:underline decoration-1 underline-offset-4">
                                {project.title}
                            </h3>
                            <p className="text-[#666666] text-sm">
                                {project.description}
                            </p>
                        </motion.div>
                    )
                )}
            </div>
        </section>
    )
}

export default ProjectGrid
