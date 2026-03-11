import { motion } from "framer-motion";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true },
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <span className="font-bold text-[#1A2E3B] text-lg tracking-tight">HDrive</span>
            <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-[#1A2E3B] transition-colors">
                    ← Voltar ao Portfólio
                </a>
                <a href="#" className="hover:text-[#1A2E3B] transition-colors font-medium">
                    Próximo Case →
                </a>
            </div>
        </div>
    </nav>
);

// ─── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => (
    <section className="pt-32 pb-0">
        <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp}>
                {/* Tag */}
                <p className="text-xs font-semibold tracking-widest uppercase text-[#E91E8C] mb-6">
                    Case Study · Plataforma B2B · 2024–2026
                </p>

                {/* Title */}
                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-[#1A2E3B] leading-[1.08] mb-8 max-w-4xl">
                    Substituí WhatsApp, e-mail e Excel de uma proptech e hoje, 340 projetos imobiliários são gerenciados em um único lugar.
                </h1>

                {/* Impact statement */}
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed mb-14">
                    Uma plataforma B2B que substituiu processos inteiramente manuais por rastreabilidade completa, do contrato à entrega das chaves.
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-10 mb-0">
                    {[
                        { label: "Role", value: "UX Designer — end-to-end" },
                        { label: "Timeline", value: "V1 em 6 meses · em evolução até v3.0" },
                        { label: "Tools", value: "Figma · Design System próprio · Framer Motion" },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                            <p className="font-semibold text-[#1A2E3B]">{value}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* Hero Media */}
        <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mt-16 bg-[#E8F4F4] flex items-center justify-center py-16 px-6"
        >
            <img
                src="./imagens/Projetos v3.png"
                alt="Housi Drive — tela de detalhe de projeto v3"
                className="max-w-5xl w-full rounded-3xl shadow-xl object-cover"
            />
        </motion.div>
    </section>
);

// ─── Context: The Problem & Solution ──────────────────────────────────────────
const ContextSection = () => (
    <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 space-y-24">
            {/* O Problema */}
            <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Desafio</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E3B] tracking-tight">O Problema</h2>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="font-semibold text-[#1A2E3B] mb-2">Do lado do usuário (incorporadoras)</p>
                        <p className="text-gray-500 leading-relaxed">
                            As incorporadoras não tinham como acompanhar em que etapa seu projeto estava. Para suprir a lacuna, colaboradores da Housi produziam{" "}
                            <strong className="text-[#1A2E3B]">mapas visuais manualmente em PowerPoint</strong> e enviavam individualmente — um processo que não escalava e dependia de cada pessoa querer (e lembrar) de enviar.
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-[#1A2E3B] mb-2">Do lado do negócio</p>
                        <p className="text-gray-500 leading-relaxed">
                            Toda a informação sobre cada projeto vivia em uma única pessoa. Arquivos trafegavam por e-mail e WhatsApp ao longo de meses, sem padrão, sem rastreabilidade — e se perdiam com o tempo. Crescer significava aumentar o risco operacional, porque não havia base estruturada, só memória individual.
                        </p>
                    </div>

                    {/* MVP Image — "before" state */}
                    <motion.img
                        {...fadeUp}
                        src="./imagens/projetos v1 mvp.png"
                        alt="Versão MVP da trilha de etapas — o ponto de partida"
                        className="w-full rounded-3xl shadow-xl mt-6 object-cover"
                    />
                    <p className="text-xs text-gray-400 text-center">V1 MVP — o ponto de partida visual antes da plataforma atual.</p>
                </div>
            </motion.div>

            {/* A Solução */}
            <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <div>
                    <p className="text-xs uppercase tracking-widest text-[#E91E8C] mb-3">Solução</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E3B] tracking-tight">A Solução</h2>
                </div>
                <div className="space-y-5 text-gray-500 leading-relaxed">
                    <p>
                        Dois ambientes conectados — um para o time interno da Housi, outro para as incorporadoras — organizados em torno de um mapa visual de cada projeto, com macro e micro-etapas, formulários, uploads de arquivos e um drive centralizado associado diretamente ao projeto.
                    </p>
                    <ul className="space-y-4">
                        {[
                            { bold: "Trilha visual de progresso por etapas", text: "Cada projeto ganhou uma linha do tempo visual com 11 macro-etapas e 33 micro-etapas, com responsável definido, status e dependências. Zero dependência do time Housi para que o cliente saiba onde o projeto está." },
                            { bold: "Formulários e uploads por subetapa", text: "Cada subetapa foi desenhada com o modelo certo — formulário com salvamento progressivo quando há dados a registrar, upload direto quando o que importa é o arquivo." },
                            { bold: "Cadastro modular com toggles de etapas", text: "Como cada contrato é customizado, o colaborador habilita ou desabilita etapas individualmente por projeto usando switches visuais." },
                            { bold: "Onboarding automático embutido no cadastro", text: "Ao cadastrar um novo projeto, o sistema valida, cria o acesso e dispara o e-mail de boas-vindas — o onboarding acontece como efeito colateral." },
                        ].map(({ bold, text }) => (
                            <li key={bold} className="flex gap-3">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#E91E8C] flex-shrink-0" />
                                <p><strong className="text-[#1A2E3B]">{bold}:</strong> {text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </div>
    </section>
);

// ─── Research & Discovery ──────────────────────────────────────────────────────
const ResearchSection = () => (
    <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp} className="mb-16">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Pesquisa</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E3B] tracking-tight">Research &amp; Discovery</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                {/* Process text + Affinity Map */}
                <motion.div {...fadeUp} className="space-y-6">
                    <p className="font-semibold text-[#1A2E3B]">Mapeamento antes de qualquer tela</p>
                    <p className="text-gray-500 leading-relaxed">
                        Antes de abrir o Figma, documentei as 11 macro-etapas e suas micro-etapas em conversas diretas com os colaboradores operacionais — as pessoas que viviam o processo no dia a dia. Mapeei responsáveis, informações trocadas em cada momento e onde o fluxo travava com mais frequência.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                        Esse mapeamento revelou que a dor principal não era visual: era de rastreabilidade e responsabilidade. Sem isso, teria construído uma interface bonita para o problema errado.
                    </p>

                    {/* Affinity Map Component */}
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4 shadow-sm overflow-hidden">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-2">Mapeamento de Arquivos &amp; Hierarquia</p>
                        <img
                            src="./imagens/mapeamento de arquivos.png"
                            alt="Diagrama de hierarquia de pastas do projeto Housi Drive"
                            className="w-full rounded-2xl object-cover"
                        />
                    </div>
                </motion.div>

                {/* User Persona Card */}
                <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg flex flex-col gap-6 h-fit"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#E8F4F4] flex items-center justify-center text-2xl font-bold text-[#1A2E3B] flex-shrink-0">
                            AP
                        </div>
                        <div>
                            <p className="font-bold text-[#1A2E3B]">Ana Paula</p>
                            <p className="text-sm text-gray-400">Gerente de Incorporação</p>
                        </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        Acompanha 4 projetos simultâneos e precisava ligar para o time Housi toda semana para saber o status de cada um.
                    </p>
                    <blockquote className="border-l-4 border-[#E91E8C] pl-5">
                        <p className="italic text-[#1A2E3B] text-lg leading-snug font-medium">
                            "Antes eu não sabia se o projeto estava atrasado ou se ninguém tinha me avisado."
                        </p>
                    </blockquote>
                </motion.div>
            </div>
        </div>
    </section>
);

// ─── Information Architecture ──────────────────────────────────────────────────
const InfoArchSection = () => (
    <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp} className="mb-16">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Arquitetura</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E3B] tracking-tight">Information Architecture</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <motion.div {...fadeUp} className="space-y-5 text-gray-500 leading-relaxed">
                    <p className="font-semibold text-[#1A2E3B] text-lg">Arquitetura de dois ambientes separados</p>
                    <p>
                        Decidir o que cada público via — e não via — foi tão importante quanto a interface. Trabalhei com fluxos separados por persona antes de qualquer wireframe: o ambiente do colaborador precisava de controle granular; o do cliente precisava ser autoexplicativo, sem jargão interno, com foco em "o que aconteceu" e "o que preciso fazer agora".
                    </p>
                    <p>
                        Só depois de validar essa separação com o time de produto parti para os wireframes.
                    </p>

                    <div className="pt-4">
                        <p className="font-semibold text-[#1A2E3B] mb-3">Wireframes de baixa fidelidade para alinhar fluxo</p>
                        <p>
                            Desenhei os principais fluxos em wireframe antes de qualquer decisão visual — especialmente o cadastro de projetos e a trilha de etapas, que tinham maior complexidade de estados. Iterar em wireframe permitiu ajustar hierarquia e lógica de interação sem custo alto.
                        </p>
                    </div>
                </motion.div>

                {/* Wireframe Low-Fi — in grayscale */}
                <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    className="space-y-3"
                >
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Wireframe Low-Fi — cadastro modular de etapas</p>
                    <img
                        src="./imagens/toggles novo projeto.png"
                        alt="Wireframe de baixa fidelidade — tela de configuração de etapas"
                        className="w-full rounded-3xl shadow-xl object-cover grayscale"
                    />
                </motion.div>
            </div>
        </div>
    </section>
);

// ─── Visual Design System ──────────────────────────────────────────────────────
const DesignSystemSection = () => {
    const colors = [
        { hex: "#E91E8C", label: "Rosa primário", note: "CTAs, destaques" },
        { hex: "#1A2E3B", label: "Azul escuro", note: "Textos, sidebar" },
        { hex: "#F5F5F5", label: "Cinza de fundo", note: "Backgrounds" },
        { hex: "#22C55E", label: "Verde de status", note: "Concluído" },
        { hex: "#F59E0B", label: "Amarelo de status", note: "Em andamento" },
    ];

    return (
        <section className="py-32">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div {...fadeUp} className="mb-16">
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Design System</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E3B] tracking-tight">Visual Design System</h2>
                </motion.div>

                <div className="space-y-16">
                    {/* Color Palette */}
                    <motion.div {...fadeUp}>
                        <p className="font-semibold text-[#1A2E3B] mb-6">Paleta de Cores</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {colors.map(({ hex, label, note }) => (
                                <div key={hex} className="flex flex-col items-center gap-3 text-center">
                                    <div
                                        className="w-16 h-16 rounded-full shadow-md border border-white"
                                        style={{ backgroundColor: hex }}
                                    />
                                    <div>
                                        <p className="text-xs font-mono text-[#1A2E3B] font-semibold">{hex}</p>
                                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                                        <p className="text-xs text-gray-400">{note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Typography */}
                    <motion.div {...fadeUp}>
                        <p className="font-semibold text-[#1A2E3B] mb-6">Tipografia — Inter</p>
                        <div className="space-y-3 bg-gray-50 rounded-3xl p-8">
                            {[
                                { weight: "700", label: "Bold", sample: "Housi Drive — Plataforma B2B", size: "text-3xl" },
                                { weight: "600", label: "SemiBold", sample: "Trilha visual de progresso por etapas", size: "text-xl" },
                                { weight: "500", label: "Medium", sample: "Cadastro modular com toggles de etapas", size: "text-base" },
                                { weight: "400", label: "Regular", sample: "Arquivos trafegavam por e-mail e WhatsApp, sem rastreabilidade.", size: "text-sm" },
                            ].map(({ weight, label, sample, size }) => (
                                <div key={weight} className="flex items-baseline gap-4">
                                    <span className="text-xs text-gray-400 w-20 flex-shrink-0">{label}</span>
                                    <span className={`${size} text-[#1A2E3B]`} style={{ fontWeight: weight }}>{sample}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Component Library */}
                    <motion.div {...fadeUp}>
                        <p className="font-semibold text-[#1A2E3B] mb-6">Component Library</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className="px-6 py-3 bg-[#E91E8C] text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition-opacity">
                                Salvar projeto
                            </button>
                            <button className="px-6 py-3 border-2 border-[#1A2E3B] text-[#1A2E3B] rounded-xl font-semibold text-sm hover:bg-[#1A2E3B] hover:text-white transition-colors">
                                Ver documentos
                            </button>
                            <button className="px-6 py-3 text-gray-500 rounded-xl font-semibold text-sm bg-gray-100 hover:bg-gray-200 transition-colors">
                                Cancelar
                            </button>
                            {/* Toggle demo */}
                            <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl px-5 py-3">
                                <div className="w-10 h-6 bg-[#22C55E] rounded-full flex items-center px-1">
                                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                                </div>
                                <span className="text-sm font-medium text-[#1A2E3B]">Etapa ativada</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ─── High-Fidelity Showcase ────────────────────────────────────────────────────
const showcaseItems = [
    {
        src: "./imagens/Clientes e projetos.png",
        alt: "Tela de listagem de incorporadoras e projetos",
        description:
            "Visibilidade consolidada — o time interno gerencia todas as incorporadoras em um único lugar, com acesso rápido a cada projeto.",
        tag: "Gestão consolidada",
    },
    {
        src: "./imagens/Upload .png",
        alt: "Componente de upload de arquivos",
        description:
            "Cada sub-etapa pede só o que precisa — upload direto para entregas de arquivo, no formato certo para cada momento.",
        tag: "Upload por subetapa",
    },
    {
        src: "./imagens/arquivos.png",
        alt: "Drive centralizado de documentos por etapa",
        description:
            "Um drive vivo — os arquivos se organizam automaticamente na pasta da etapa correspondente, com rastreabilidade completa.",
        tag: "Drive centralizado",
    },
    {
        src: "./imagens/projeto criado mvp.png",
        alt: "Modal de confirmação de projeto criado",
        description:
            "O onboarding acontece como efeito colateral — ao cadastrar o projeto, o cliente já recebe acesso sem nenhuma etapa extra.",
        tag: "Onboarding automático",
    },
];

const ShowcaseSection = () => (
    <section className="py-32 bg-[#1A2E3B]">
        <div className="max-w-6xl mx-auto px-6 mb-16">
            <motion.div {...fadeUp}>
                <p className="text-xs uppercase tracking-widest text-[#E91E8C] mb-3">Telas Finais</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">High-Fidelity Showcase</h2>
            </motion.div>
        </div>

        <div className="space-y-0">
            {showcaseItems.map(({ src, alt, description, tag }, i) => (
                <motion.div
                    key={src}
                    {...fadeUp}
                    transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.05 }}
                    className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`}
                >
                    {/* Image — full bleed */}
                    <div className="w-full md:w-3/5 overflow-hidden">
                        <img
                            src={src}
                            alt={alt}
                            className="w-full h-full object-cover"
                            style={{ maxHeight: "480px" }}
                        />
                    </div>

                    {/* Text panel */}
                    <div className="w-full md:w-2/5 px-10 py-16 flex flex-col justify-center gap-4">
                        <span className="text-xs font-semibold tracking-widest uppercase text-[#E91E8C]">{tag}</span>
                        <p className="text-white text-xl font-medium leading-relaxed">{description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
);

// ─── Conclusion ────────────────────────────────────────────────────────────────
const ConclusionSection = () => (
    <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp} className="mb-16">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Resultado</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E3B] tracking-tight">Conclusão</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <motion.div {...fadeUp} className="space-y-8">
                    <p className="text-gray-500 leading-relaxed">
                        O Housi Drive substituiu um processo inteiramente manual e fragmentado por uma plataforma centralizada com rastreabilidade completa.
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { value: "340", label: "projetos cadastrados", note: "cada um com trilha de etapas, documentos e histórico centralizados" },
                            { value: "+80", label: "incorporadoras", note: "com acesso ao próprio ambiente, sem depender do time Housi" },
                            { value: "+8", label: "colaboradores", note: "operando com visibilidade consolidada para a liderança" },
                        ].map(({ value, label, note }) => (
                            <div key={label} className="flex gap-5 items-start">
                                <span className="text-4xl font-bold text-[#E91E8C] leading-none flex-shrink-0">{value}</span>
                                <div>
                                    <p className="font-semibold text-[#1A2E3B]">{label}</p>
                                    <p className="text-sm text-gray-400">{note}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Learning */}
                    <div className="bg-[#E8F4F4] rounded-3xl p-8">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Aprendizado principal</p>
                        <p className="text-[#1A2E3B] leading-relaxed">
                            Validaria o modelo de navegação de documentos com um protótipo antes do desenvolvimento. A decisão de usar componente pré-pronto foi correta para o prazo, mas chegamos ao limite dele antes de ter capacidade de redesenhar — um teste mais cedo teria antecipado a fricção que o usuário enfrentou por um período.
                        </p>
                    </div>
                </motion.div>

                {/* NPS image — centered, smaller, as a final visual note */}
                <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                    className="flex flex-col items-center gap-4"
                >
                    <img
                        src="./imagens/NPS.png"
                        alt="Modal de avaliação NPS do produto"
                        className="w-64 rounded-3xl shadow-xl object-cover"
                    />
                    <p className="text-xs text-gray-400 text-center max-w-xs">
                        O ciclo completo fecha no usuário final — coletando feedback diretamente na plataforma.
                    </p>
                </motion.div>
            </div>
        </div>
    </section>
);

// ─── Page Footer ───────────────────────────────────────────────────────────────
const PageFooter = () => (
    <footer className="py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <span className="font-bold text-[#1A2E3B]">HDrive</span>
            <div className="flex gap-6">
                <a href="#" className="hover:text-[#1A2E3B] transition-colors">← Voltar ao Portfólio</a>
                <a href="#" className="hover:text-[#E91E8C] transition-colors font-medium">Próximo Case →</a>
            </div>
        </div>
    </footer>
);

// ─── Root Component ────────────────────────────────────────────────────────────
const HouiDrivePage = () => (
    <div className="bg-white font-sans text-base">
        <Navbar />
        <Hero />
        <ContextSection />
        <ResearchSection />
        <InfoArchSection />
        <DesignSystemSection />
        <ShowcaseSection />
        <ConclusionSection />
        <PageFooter />
    </div>
);

export default HouiDrivePage;
