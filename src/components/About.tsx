import { motion } from 'framer-motion'

const expertiseCards = [
    {
        title: 'Design Systems em escala',
        items: [
            'Governança + padrões reutilizáveis',
            'Documentação acessível para áreas não técnicas',
            'Cobertura: app, ERP, SaaS, site e totem',
        ],
    },
    {
        title: 'Entrega com eficiência',
        items: [
            'Processos de prototipação e handoff otimizados',
            'Design QA e alinhamento contínuo com dev/QA',
            'IA para execução e documentação',
        ],
    },
    {
        title: 'Ecossistemas e produto',
        items: [
            'Fluxos complexos com modularidade por contexto',
            'Redução de complexidade operacional e suporte',
            'Foco em rotinas e serviços para usuários finais',
        ],
    },
]

const About = () => {
    return (
        <section id="about-me" className="py-20 md:py-32">
            <div className="flex flex-col md:flex-row gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-[60%]"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tightest mb-8 text-[#050505]">
                        Quem sou eu.
                    </h2>
                    <div className="space-y-6 text-lg text-[#666666] leading-relaxed">
                        <p>
                            Product Designer com mais de 7 anos no mercado, atuando em startup proptech
                            (B2C e B2B) na liderança da equipe de Design.
                        </p>
                        <p>
                            Escalei um Design System usado em mais de 6 produtos e 200+ landing pages,
                            cobrindo App, ERP, SaaS, Site e Totens de venda, com documentação acessível para toda a empresa.
                        </p>
                        <p>
                            Reduzi entregas de três dias para um dia, com processos de design, handoff eficiente e uso de IA no dia a dia.
                        </p>
                        <p>
                            Coordenei e desenhei um ecossistema condominial rodando em mais de 110 condomínios na grande São Paulo, com mais
                            de 20 funcionalidades para morador e síndico/gestor.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-[40%] aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-xl"
                >
                    <img
                        src="/images/profilepic.jpg"
                        alt="Vinícius Falcão"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </div>

            {/* Expertise Cards */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16"
            >
                {expertiseCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                        className="bg-[#F5F5F5] rounded-2xl p-6 flex flex-col gap-4"
                    >
                        <h3 className="text-sm font-semibold text-[#050505] tracking-tightest">
                            {card.title}
                        </h3>
                        <ul className="space-y-2">
                            {card.items.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-[#666666] leading-snug">
                                    <span className="text-[#050505] mt-0.5 shrink-0">›</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}

export default About
