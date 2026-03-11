import { LazyMotion, domAnimation, m, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AudioWaveButton from "../components/AudioWaveButton";
import AudioPlayerBar, { useAudioPlayer } from "../components/AudioPlayerBar";

// ─── Layout tokens ─────────────────────────────────────────────────────────────
const TEXT_COL = "max-w-[660px] mx-auto";
const WIDE_COL = "max-w-[960px] mx-auto";

// ─── Variant presets — definidos FORA de componentes (referência estável) ─────
// Regra: rerender-variants-object (CRITICAL) — objetos inline recriados a cada
// render fazem o Framer Motion reiniciar animações desnecessariamente.
const vFadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const vFadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const vScaleIn = { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } };
const vSlideL = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

// Containers com stagger — acionam os filhos em cascata
const vStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const vStaggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

// ─── Spring configs — física real, interruptível (spring-physics-based) ────────
// easeOut/duration "trava" se o usuário scrollar rápido; springs preservam momentum.
const sSnap = { type: "spring", stiffness: 320, damping: 26 };   // hover/tap
const sGentle = { type: "spring", stiffness: 200, damping: 22 };   // entradas de seção
const sEntry = { type: "spring", stiffness: 260, damping: 28 };   // navbar / hero

// ─── Transição de conteúdo ao trocar switch ─────────────────────────────────────
// fade suave: sai com opacity 0 + leve y para cima, entra com fade + y de baixo
const vPageSwitch = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};

// ─── Animação de palavra por palavra (typewriter stagger) ───────────────────────
// Cada palavra é um span animado individualmente em cascata rápida
const vWordContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.045 } } };
const vWord = {
    hidden: { opacity: 0, y: 8, filter: "blur(3px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.22, ease: "easeOut" } },
};

// ─── FadeUp — wrapper reutilizável com prefers-reduced-motion ──────────────────
// Ao detectar reduced motion, renderiza sem qualquer animação (zero JS extra).
const FadeUp = ({ children, className = "", delay = 0 }) => {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <m.div
            variants={vFadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ ...sGentle, delay }}
            viewport={{ once: true, margin: "-80px" }}
            className={className}
        >
            {children}
        </m.div>
    );
};

// ─── AnimatedText — divide texto em palavras e anima cada uma em stagger ───────
// triggerKey: muda a key para reiniciar a animação ao trocar switch
const AnimatedText = ({ children, className = "", triggerKey, as: Tag = "span" }) => {
    const reduced = useReducedMotion();
    if (reduced) return <Tag className={className} dangerouslySetInnerHTML={{ __html: String(children) }} />;

    // Regex para capturar palavras OU tags HTML completas
    // [\w-\u00C0-\u00FF]+ matches words with accents
    // <[^>]+> matches HTML tags
    const tokens = String(children).match(/(<[^>]+>|[\w\u00C0-\u00FFáéíóúÁÉÍÓÚçÇ.,+!?-]+|\s+)/g) || [];

    return (
        <m.span
            key={triggerKey}
            className={className}
            variants={vWordContainer}
            initial="hidden"
            animate="visible"
            style={{ display: "inline" }}
        >
            {tokens.map((token, i) => {
                // Se for tag HTML, renderiza via dangerouslySetInnerHTML sem o wrapper de animação individual (ou mantém inline)
                if (token.startsWith("<")) {
                    return <span key={i} dangerouslySetInnerHTML={{ __html: token }} />;
                }
                // Se for apenas espaço, renderiza normal
                if (token.trim() === "") {
                    return <span key={i}>{token}</span>;
                }
                // Se for palavra, anima
                return (
                    <m.span
                        key={i}
                        variants={vWord}
                        style={{ display: "inline-block" }}
                    >
                        {token}
                    </m.span>
                );
            })}
        </m.span>
    );
};

// ─── Traduções PT/EN ────────────────────────────────────────────────────────────
const T = {
    "pt-br": {
        // Navbar
        navBack: "← Voltar ao Portfólio",
        navBackShort: "← Voltar",
        navNext: "Próximo Case →",
        navNextShort: "Próximo →",

        // Hero
        heroLabel: "Design de produto · SOFTWARE B2B",
        heroSubtitle: "Processos manuais dão lugar a visibilidade em tempo real, rastreabilidade e eficiência, do contrato à entrega das chaves",

        // Sec 2 — Problema
        sec2Label: "Contexto e Desafios",
        sec2Title: "O Problema",
        sec2Intro1: "A Housi é uma Proptech brasileira que oferece tecnologia predial, arquitetura e expertise em vendas para incorporadoras.",
        sec2Intro2: "Cada contrato é personalizado e cada projeto percorre um ciclo longo de muitas etapas que perduram entre meses e anos, da assinatura até a entrega das chaves do imóvel.",
        sec2BadgeClient: "Do lado do cliente",
        sec2Client1: "Incorporadoras não tinham visibilidade sobre prazos ou status das entregas, dependendo de:",
        sec2ClientList: ["Consulta a emails,", "Mensagens antigas,", "Respostas assíncronas."],
        sec2Client2: "Para suprir a demanda, a área de negócio produzia manualmente, mapas visuais e reports em PowerPoint para atualizar cada cliente individualmente.",
        sec2BadgeBiz: "Do lado do negócio",
        sec2Biz1: "Toda a informação sobre os projetos existia entre planilhas de Excell compartilhadas localmente entre os responsáveis.",
        sec2Biz2: "Arquivos chave para momentos importantes dividiam-se entre e-mail e whatsapp ao longo dos meses, sem padrão ou rastreabilidade e se perdiam facilmente com o tempo, gerando mais custo de tempo no dia a dia do colaborador.",
        sec2BizNote: "Processo nada escalável, totalmente dependente de um alto custo operacional em numero de pessoas e horas de trabalho.",

        // Sec 3 — Solução
        sec3Label: "Solução",
        sec3Title: "A Solução",
        sec3Intro1: "Um sistema interno exclusivo para a interação com o cliente no pós venda.",
        sec3Intro2: "Todos os arquivos centralizados em um drive exclusivo por cliente e projeto, atualização em tempo real com a lista de tarefas em etapas que geram um mapa visual do projeto.",
        sec3IntroTag: "Tudo em um só lugar",
        sec3F1Title: "Mapa visual atualizado em tempo real:",
        sec3F1P1: "Cada projeto ganhou uma linha do tempo visual com 11 macro-etapas e 33 micro-etapas.",
        sec3F1P2: "Cada uma com responsável definido (Housi ou incorporador), status e dependências.",
        sec3F1P3: "As incorporadoras passaram a ver, em tempo real, o que aconteceu e o que precisam fazer agora.",
        sec3F2Title: "Formulários e uploads mapeados por subetapa",
        sec3F2P1: "Antes, cada subetapa seguia o mesmo fluxo: o colaborador enviava por e-mail um modelo em Word ou Excel para a incorporadora preencher e devolver. Sem padrão, pouca rastreabilidade e muito demorado.",
        sec3F2P2: "A partir disso, cada subetapa foi desenhada com o modelo certo para ela, formulários com salvamento progressivo, upload direto quando o que importa é o arquivo.",
        sec3F2P3: "O conteúdo é organizado automaticamente na pasta da etapa correspondente.",
        sec3F3Title: "Projetos flexíveis e fáceis de customizar",
        sec3F3P: "Como cada contrato é customizado, a plataforma reflete isso. O colaborador habilita ou desabilita etapas e subetapas individualmente por projeto, usando switches visuais. Simples, sem ambiguidade e com efeito imediato na trilha que o cliente enxerga.",
        sec3F3Footer: "Liberdade e agilidade para criar, organizar ou editar projetos para o colaborador.",
        sec3F4Title: "Cadastro automático de clientes embutido na criação de projetos",
        sec3F4P: "Ao cadastrar um novo projeto, o colaborador preenche o e-mail do cliente como campo obrigatório. O sistema valida, cria o acesso (se necessário) e dispara o e-mail de boas-vindas — o cliente chega à plataforma com o projeto já visível.",
        sec3F4Footer: "O onboarding acontece como efeito colateral do que o colaborador já faria.",

        // Sec 4 — Pesquisa
        sec4Label: "Processo",
        sec4Title: "Pesquisas e descobertas",
        sec4P1: "Conversas diretas com a liderança da área de negócio me levaram a acompanhar de perto o dia a dia de 5 colaboradores responsáveis pelo fluxo de trabalho.",
        sec4P2: "Mapeei responsáveis, informações trocadas em cada momento e onde o fluxo travava com mais frequência.",
        sec4P3Bold: "11 macro-etapas e 33 micro-etapas documentadas",
        sec4P3: " que traduziam todo o fluxo de operação que se iniciava na assinatura do contrato e finalizava no lançamento do empreendimento às vendas em mercado.",
        sec4Caption1: "Mapeamento e documentação da estrutura de pastas e subpastas correspondentes a cada etapa e subetapa do fluxo.",
        sec4Caption2: "Existe uma pasta correspondente a cada micro-etapa do projeto, pronta para armazenar todo o contexto e arquivos da etapa.",

        // Sec 5 — Arquitetura
        sec5Label: "Arquitetura",
        sec5Title: "Arquitetura do MVP",
        sec5P1: "Uma unica plataforma mas com visualização separada por perfil de usuário. Organizar a ordem das ações, quem veria cada dado e o momento certo para colher informações importantes foi primordial.\nO ambiente do colaborador precisava de controle modular.",
        sec5P2: "O cliente precisava ser autoexplicativo, sem jargão interno, com foco em \"o que aconteceu\" e \"o que preciso fazer agora\".",
        sec5ColBizHeader: "Negócio - Colaborador Housi",
        sec5ColBiz1Title: "ACESSA A PLATAFORMA",
        sec5ColBiz1P: "Autenticação por email corporativo e senha.",
        sec5ColBiz2Title: "CONSOME Dashboard",
        sec5ColBiz2P1: "Tela de início.",
        sec5ColBiz2P2: "Tabela com listagem dos clientes e projetos",
        sec5ColBiz3Title: "+ Novo projeto",
        sec5ColBiz3List: ["Nome e categoria do projeto,", "identifica a Incorporadora responsável,", "E-mail do cliente gera cadastro automático,"],
        sec5ColBiz3Confirm: "Confirmar e Criar Projeto",
        sec5ColBiz3Pre: "Preenchimento das informações essenciais:",
        sec5ColBizAutoTitle: "Ação automática",
        sec5ColBizAutoList: ["Valida o e-mail informado no cadastro", "Cria o acesso do cliente se ainda não existir", "Dispara o e-mail de boas-vindas com link de primeiro acesso"],
        sec5ColBizMonTitle: "Monitoramento e atualizaçao dos dados",
        sec5ColBizEtapasTitle: "Ação · Etapas",
        sec5ColBizEtapasP: "Preenche formulários e avança subetapas sob responsabilidade da Housi.",
        sec5ColBizEtapasList: ["Salvamento progressivo por formulário", "Registro de datas, aprovações e observações"],
        sec5ColBizUpTitle: "Ação · uploads",
        sec5ColBizUpP: "Uploads organizados automaticamente, arquivos são direcionados para suas respectivas pastas sem necessidade de ação manual.",
        sec5ColBizConclTitle: "Ação · Conclusão",
        sec5ColBizConclP: "Valida o preenchimento das informações e marca subetapas como concluídas, atualiza a trilha do projeto em tempo real.",
        sec5ColBizCycle: "Ciclo contínuo",
        sec5ColClientHeader: "Cliente - Incorporadoras",
        sec5ColClient1Title: "EMAIL DE PRIMEIRO ACESSO",
        sec5ColClient1P: "Cliente clica no link → define sua senha → entra com o projeto já configurado e visível",
        sec5ColClient2Title: "Meus Projetos",
        sec5ColClient2P1: "Trilha Visual de Progresso e listagem de etapas com responsabilidades por perfil",
        sec5ColClient2P2: "Status: Não iniciado · Em andamento · Concluído",
        sec5ColClient2P3: "Responsável de cada subetapa indicado",
        sec5ColClient2P4: "Histórico de ações registrado por data",
        sec5ColClient3Title: "Interagindo com o projeto",
        sec5ColClient3ATitle: "Ação · preenchendo informações",
        sec5ColClient3ABold: "Formulários",
        sec5ColClient3AList: ["Salvamento progressivo ·", "Dividido em partes", "Vira um documento em PDF, salvo automaticamente para documentar o preenchimento dos dados."],
        sec5ColClient3BTitle: "Ação · Upload",
        sec5ColClient3BBold: "Formulários",
        sec5ColClient3BList: ["Envio facilitado de arquivos DWG, PDF, JPEG, PNG, GIF, Pptx, Docx, Excell", "Arquivos são organizados automaticamente de acordo com sua etapa"],
        sec5ColClient3CTitle: "Ação · consome arquivos",
        sec5ColClient3CBold: "Drive de arquivos",
        sec5ColClient3CList: ["Estrutura de pastas do projeto é um espelho direto da configuraçao de etapas do projeto, o cliente explora os arquivos de acordo com o contexto de cada um.", "Baixa, visualiza histórico de versóes, deixa comentários."],

        // Sec 6 — Resultados
        sec6Label: "conclusão",
        sec6Title: "Resultados",
        sec6P: "Em 6 meses após sua implantação, o Housi Drive substituiu um processo inteiramente manual e fragmentado por uma plataforma centralizada com rastreabilidade completa.",
        sec6M1Value: "+340",
        sec6M1Title: "Projetos cadastrados",
        sec6M1P: "Cada um com trilha de etapas, documentos e histórico centralizados",
        sec6M2Value: "+80",
        sec6M2Title: "Usuários clientes",
        sec6M2P: "Com acesso constante, colaborando com os projetos em tempo real.",
        sec6M3Value: "12",
        sec6M3Title: "Usuários internos",
        sec6M3P: "Operando no dia a dia, com eficiência, visibilidade e escala",

        // Sec 7 — Papel
        sec7Label: "atuação",
        sec7Title: "Meu papel",
        sec7P1: "Fui o designer responsável pelo produto do início ao fim.",
        sec7P2: "Conduzi as conversas com cada área envolvida no fluxo operacional, produto e desenvolvimento, mapeei o processo, desenhei a solução, validei com os usuários e iterei com base no uso real.",
        sec7P3: "Negociei escopo e priorizações diretamente com produto e tech, e busquei ativamente junto aos desenvolvedores formas de otimizar o desenvolvimento com uso de componentes reutilizáveis.",
        sec7P4: "A partir da V2, liderei a operação com um designer júnior que me auxiliou na execução do design, coordenando entregas, revisando trabalho e garantindo consistência com escalabilidade do produto.",
        sec7LearLabel: "melhorias",
        sec7LearTitle: "Aprendizados",
        sec7LearP: "Validaria o modelo de navegação de documentos mais cedo com o time de desenvolvimento. A primeira estrutura de navegação teve um grande impedimento na construção dos componentes o que nos levou a decisão de usar um modelo de componente pré-pronto para garantir o o prazo de lançamento do MVP mas que não satisfazia 100% das nossas expectativas do protótipo inicial.",

        // Sec 8 — Showcase
        sec8Label: "visual",
        sec8Title: "Product Showcase",

        // Footer
        footerBack: "← Voltar ao Portfólio",
        footerNext: "Próximo Case →",
    },
    "en-us": {
        // Navbar
        navBack: "← Back to Portfolio",
        navBackShort: "← Back",
        navNext: "Next Case →",
        navNextShort: "Next →",

        // Hero
        heroLabel: "Product Design · B2B SOFTWARE",
        heroSubtitle: "Manual processes give way to real-time visibility, traceability and efficiency — from contract signing to key handover",

        // Sec 2 — Problem
        sec2Label: "Context & Challenges",
        sec2Title: "The Problem",
        sec2Intro1: "Housi is a Brazilian Proptech that offers building technology, architecture, and sales expertise to real estate developers.",
        sec2Intro2: "Every contract is customized and each project runs through a long cycle of many phases spanning months to years, from contract signing to key delivery.",
        sec2BadgeClient: "Client side",
        sec2Client1: "Real estate developers had no visibility into deadlines or delivery status, relying on:",
        sec2ClientList: ["Searching through emails,", "Old messages,", "Asynchronous responses."],
        sec2Client2: "To address the demand, the business team manually produced visual maps and PowerPoint reports to update each client individually.",
        sec2BadgeBiz: "Business side",
        sec2Biz1: "All project information lived across Excel spreadsheets shared locally between those responsible.",
        sec2Biz2: "Key files for important milestones were scattered across email and WhatsApp over months, with no standard or traceability, easily getting lost over time and generating extra operational costs.",
        sec2BizNote: "A completely unscalable process, entirely dependent on high operational costs in headcount and working hours.",

        // Sec 3 — Solution
        sec3Label: "Solution",
        sec3Title: "The Solution",
        sec3Intro1: "An exclusive internal system for post-sale client interaction.",
        sec3Intro2: "All files centralized in a dedicated drive per client and project, real-time updates with a phased task list that generates a visual project map.",
        sec3IntroTag: "Everything in one place",
        sec3F1Title: "Visual map updated in real time:",
        sec3F1P1: "Each project got a visual timeline with 11 macro-phases and 33 micro-phases.",
        sec3F1P2: "Each with a defined owner (Housi or developer), status, and dependencies.",
        sec3F1P3: "Real estate developers could now see, in real time, what happened and what they need to do next.",
        sec3F2Title: "Forms and uploads mapped per sub-phase",
        sec3F2P1: "Before, every sub-phase followed the same flow: the employee emailed a Word or Excel template for the developer to fill out and return. No standard, little traceability, and very slow.",
        sec3F2P2: "From there, each sub-phase was designed with the right model — forms with progressive saving, direct upload when the file is what matters.",
        sec3F2P3: "Content is automatically organized into the corresponding phase folder.",
        sec3F3Title: "Flexible projects, easy to customize",
        sec3F3P: "Since every contract is customized, the platform reflects that. The employee enables or disables phases and sub-phases individually per project using visual switches. Simple, unambiguous, with immediate effect on what the client sees.",
        sec3F3Footer: "Freedom and agility to create, organize or edit projects for the employee.",
        sec3F4Title: "Automatic client registration built into project creation",
        sec3F4P: "When creating a new project, the employee fills in the client's email as a required field. The system validates it, creates the access (if needed), and sends the welcome email — the client arrives at the platform with the project already visible.",
        sec3F4Footer: "Onboarding happens as a side effect of what the employee was already doing.",

        // Sec 4 — Research
        sec4Label: "Process",
        sec4Title: "Research & Findings",
        sec4P1: "Direct conversations with business area leadership led me to closely follow the daily routine of 5 employees responsible for the workflow.",
        sec4P2: "I mapped owners, information exchanged at each moment, and where the flow most frequently got stuck.",
        sec4P3Bold: "11 macro-phases and 33 micro-phases documented",
        sec4P3: " translating the entire operational flow from contract signing to project launch.",
        sec4Caption1: "Mapping and documentation of folder and subfolder structure corresponding to each phase and sub-phase of the flow.",
        sec4Caption2: "There is a folder for each project micro-phase, ready to store all the context and files for that phase.",

        // Sec 5 — Architecture
        sec5Label: "Architecture",
        sec5Title: "MVP Architecture",
        sec5P1: "A single platform with separate views per user profile. Organizing the sequence of actions, who would see each piece of data, and the right moment to collect key information was essential.\nThe employee environment needed modular control.",
        sec5P2: "The client side needed to be self-explanatory, free of internal jargon, focused on \"what happened\" and \"what do I need to do now\".",
        sec5ColBizHeader: "Business - Housi Employee",
        sec5ColBiz1Title: "ACCESS THE PLATFORM",
        sec5ColBiz1P: "Authentication via corporate email and password.",
        sec5ColBiz2Title: "CONSUME Dashboard",
        sec5ColBiz2P1: "Home screen.",
        sec5ColBiz2P2: "Table listing clients and projects",
        sec5ColBiz3Title: "+ New Project",
        sec5ColBiz3List: ["Project name and category,", "Identifies the responsible developer,", "Client email generates automatic registration,"],
        sec5ColBiz3Confirm: "Confirm and Create Project",
        sec5ColBiz3Pre: "Fill in essential information:",
        sec5ColBizAutoTitle: "Automatic action",
        sec5ColBizAutoList: ["Validates the email entered during registration", "Creates client access if it doesn't yet exist", "Sends welcome email with first-access link"],
        sec5ColBizMonTitle: "Monitoring and data updates",
        sec5ColBizEtapasTitle: "Action · Phases",
        sec5ColBizEtapasP: "Fills forms and advances sub-phases under Housi's responsibility.",
        sec5ColBizEtapasList: ["Progressive saving per form", "Recording of dates, approvals and notes"],
        sec5ColBizUpTitle: "Action · Uploads",
        sec5ColBizUpP: "Uploads automatically organized — files are directed to their respective folders without manual action.",
        sec5ColBizConclTitle: "Action · Completion",
        sec5ColBizConclP: "Validates information and marks sub-phases as complete, updating the project timeline in real time.",
        sec5ColBizCycle: "Continuous cycle",
        sec5ColClientHeader: "Client - Real Estate Developers",
        sec5ColClient1Title: "FIRST ACCESS EMAIL",
        sec5ColClient1P: "Client clicks the link → sets their password → enters with the project already configured and visible",
        sec5ColClient2Title: "My Projects",
        sec5ColClient2P1: "Visual progress timeline and phase listing with responsibilities per profile",
        sec5ColClient2P2: "Status: Not started · In progress · Completed",
        sec5ColClient2P3: "Owner of each sub-phase indicated",
        sec5ColClient2P4: "Action history recorded by date",
        sec5ColClient3Title: "Interacting with the project",
        sec5ColClient3ATitle: "Action · Filling in information",
        sec5ColClient3ABold: "Forms",
        sec5ColClient3AList: ["Progressive saving ·", "Divided into parts", "Becomes a PDF document, automatically saved to record data submission."],
        sec5ColClient3BTitle: "Action · Upload",
        sec5ColClient3BBold: "Forms",
        sec5ColClient3BList: ["Easy file upload: DWG, PDF, JPEG, PNG, GIF, Pptx, Docx, Excel", "Files are automatically organized according to their phase"],
        sec5ColClient3CTitle: "Action · Consume files",
        sec5ColClient3CBold: "File drive",
        sec5ColClient3CList: ["The project folder structure is a direct mirror of the project phase setup — the client explores files according to each one's context.", "Downloads, views version history, leaves comments."],

        // Sec 6 — Results
        sec6Label: "conclusion",
        sec6Title: "Results",
        sec6P: "Six months after launch, Housi Drive replaced an entirely manual and fragmented process with a centralized platform offering complete traceability.",
        sec6M1Value: "+340",
        sec6M1Title: "Projects registered",
        sec6M1P: "Each with a phase timeline, documents, and centralized history",
        sec6M2Value: "+80",
        sec6M2Title: "Client users",
        sec6M2P: "With constant access, collaborating on projects in real time.",
        sec6M3Value: "12",
        sec6M3Title: "Internal users",
        sec6M3P: "Operating daily, with efficiency, visibility, and scale",

        // Sec 7 — Role
        sec7Label: "role",
        sec7Title: "My role",
        sec7P1: "I was the designer responsible for the product from start to finish.",
        sec7P2: "I led conversations with every area involved in the operational flow — product and development — mapped the process, designed the solution, validated with users, and iterated based on real usage.",
        sec7P3: "I negotiated scope and priorities directly with product and tech, and actively worked with developers to optimize builds using reusable components.",
        sec7P4: "From V2 onward, I led operations alongside a junior designer who assisted with design execution — coordinating deliveries, reviewing work, and ensuring consistency as the product scaled.",
        sec7LearLabel: "improvements",
        sec7LearTitle: "Learnings",
        sec7LearP: "I would validate the document navigation model earlier with the development team. The first navigation structure hit a major obstacle during component development, leading us to adopt a pre-built component model to meet the MVP launch deadline — though it didn't fully satisfy our initial prototype expectations.",

        // Sec 8 — Showcase
        sec8Label: "visual",
        sec8Title: "Product Showcase",

        // Footer
        footerBack: "← Back to Portfolio",
        footerNext: "Next Case →",
    },
};

// ─── Navbar ────────────────────────────────────────────────────────────────────
// Entra do topo com spring no mount. Após scroll da Hero, exibe os switches
// de leitura e idioma apenas em desktop (md:).
const Navbar = ({ lang, viewMode, onModeChange, onLangChange, heroRef }) => {
    const navigate = useNavigate();
    const reduced = useReducedMotion();
    const t = T[lang] ?? T["pt-br"];
    const [showSwitches, setShowSwitches] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef?.current) return;
            const heroBottom = heroRef.current.getBoundingClientRect().bottom;
            setShowSwitches(heroBottom < 0);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [heroRef]);

    return (
        <m.nav
            className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100"
            initial={reduced ? false : { y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...sEntry, delay: 0.1 }}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                <span className="font-bold text-[#1A2E3B] text-lg tracking-tight shrink-0">HDrive</span>

                {/* Switches — aparecem apenas em desktop, após scroll da Hero */}
                <AnimatePresence>
                    {showSwitches && (
                        <m.div
                            key="nav-switches"
                            className="hidden md:flex items-center gap-[8px]"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                            <PillSwitch
                                value={viewMode}
                                onChange={onModeChange}
                                options={lang === "pt-br"
                                    ? [
                                        { value: "detalhado", label: "Leitura completa · 8min" },
                                        { value: "resumo", label: "Rápida · 4min" },
                                    ]
                                    : [
                                        { value: "detalhado", label: "Full read · 8min" },
                                        { value: "resumo", label: "Quick · 4min" },
                                    ]
                                }
                            />
                            <PillSwitch
                                value={lang}
                                onChange={onLangChange}
                                options={[
                                    { value: "pt-br", label: "PT.BR" },
                                    { value: "en-us", label: "EN.US" },
                                ]}
                            />
                        </m.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-3 md:gap-6 text-sm text-gray-500 shrink-0">
                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer hover:text-[#1A2E3B] transition-colors duration-200 whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">{t.navBack}</span>
                        <span className="sm:hidden">{t.navBackShort}</span>
                    </button>
                    <a
                        href="#"
                        className="cursor-pointer hover:text-[#E91E8C] transition-colors duration-200 font-medium whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">{t.navNext}</span>
                        <span className="sm:hidden">{t.navNextShort}</span>
                    </a>
                </div>
            </div>
        </m.nav>
    );
};

// ─── PillSwitch — switch genérico com ícone à esquerda (estrutura do Figma node 26:40) ───
// Estrutura: [ícone circular] [pill com opções]
// Ícone: fundo #E6E7E9, padding 8px, rounded-full, imagem 24×24
// Pill: fundo #E6E7E9, borda #D2D4D7, padding 4px, opção ativa = bg-white + text rosa

const PillSwitch = ({ options, value, onChange, icon }) => (
    <div className="flex items-center gap-[8px]">
        {/* Ícone à esquerda — círculo cinza com imagem */}
        {icon && (
            <div className="flex items-center justify-center bg-[#E6E7E9] rounded-full p-[8px] shrink-0">
                <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    className="w-[24px] h-[24px]"
                />
            </div>
        )}
        {/* Pill switch */}
        <div className="inline-flex items-center bg-[#E6E7E9] border border-[#D2D4D7] rounded-full p-[4px]">
            {options.map((opt) => {
                const isActive = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`flex items-center justify-center rounded-full px-[16px] py-[6px] transition-colors duration-200 cursor-pointer ${
                            isActive ? "bg-white" : "bg-transparent hover:bg-white/40"
                        }`}
                    >
                        <span className={`font-semibold text-[12px] tracking-[0.144px] uppercase leading-[1.4] whitespace-nowrap transition-colors duration-200 ${
                            isActive ? "text-[#FA2F93]" : "text-[#4D5560]"
                        }`}>
                            {opt.label}
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
);

// ─── Hero ──────────────────────────────────────────────────────────────────────
// Layout 2 colunas: texto à esq, card de metadata à dir rotacionado.
const Hero = ({ viewMode, onModeChange, lang, onLangChange, audioPlaying, onAudioToggle }) => {
    const reduced = useReducedMotion();
    const t = T[lang] ?? T["pt-br"];
    return (
        <section className="pt-20 pb-0 bg-[#F6F9FB]">
            <div className="max-w-6xl mx-auto px-6 md:px-16 pt-10 pb-20">
                <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">

                    {/* ── Coluna esquerda: texto ── */}
                    <m.div
                        className="flex-1 flex flex-col gap-10"
                        variants={reduced ? undefined : vStagger}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                    >
                        {/* Label */}
                        <m.p
                            variants={reduced ? undefined : vFadeUp}
                            transition={sGentle}
                            className="text-sm font-semibold tracking-widest uppercase text-[#FA2F93]"
                        >
                            {t.heroLabel}
                        </m.p>

                        {/* Título com palavras destacadas — reanima ao trocar idioma */}
                        <m.h1
                            variants={reduced ? undefined : vFadeUp}
                            transition={sGentle}
                            className="text-[32px] md:text-[40px] font-bold tracking-tight text-[#19202B] leading-[1.4]"
                        >
                            {lang === "pt-br" ? (
                                <>
                                    Como{" "}
                                    <span className="text-[#FA2F93]">reduzi a perda de informação</span>
                                    {" "}entre trocas de e-mail, whatsapp e excel de uma Proptech com uma plataforma própria de gestão{" "}
                                    <span className="text-[#FA2F93]">com +340 projetos</span>
                                    {" "}gerenciados.
                                </>
                            ) : (
                                <>
                                    How I{" "}
                                    <span className="text-[#FA2F93]">reduced information loss</span>
                                    {" "}across email, WhatsApp and Excel exchanges at a Proptech with a proprietary management platform handling {" "}
                                    <span className="text-[#FA2F93]">+340 projects</span>
                                    {" "}
                                </>
                            )}
                        </m.h1>

                        {/* Subtítulo — reanima ao trocar idioma */}
                        <m.p
                            variants={reduced ? undefined : vFadeUp}
                            transition={sGentle}
                            className="text-xl text-[#2E3744] leading-[1.4]"
                        >
                            <AnimatedText triggerKey={lang}>
                                {t.heroSubtitle}
                            </AnimatedText>
                        </m.p>

                        {/* Switches — leitura + idioma empilhados (estrutura Figma) */}
                        <m.div
                            variants={reduced ? undefined : vFadeUp}
                            transition={sGentle}
                            className="flex flex-col gap-[8px] self-start"
                        >
                            {/* Switch de leitura */}
                            <PillSwitch
                                value={viewMode}
                                onChange={onModeChange}
                                icon="/images/housi-drive/icon-leitura.svg"
                                options={lang === "pt-br"
                                    ? [
                                        { value: "detalhado", label: "Leitura completa · 8min" },
                                        { value: "resumo", label: "Rápida · 4min" },
                                    ]
                                    : [
                                        { value: "detalhado", label: "Full read · 8min" },
                                        { value: "resumo", label: "Quick · 4min" },
                                    ]
                                }
                            />
                            {/* Switch de idioma */}
                            <PillSwitch
                                value={lang}
                                onChange={onLangChange}
                                icon="/images/housi-drive/icon-idioma.svg"
                                options={[
                                    { value: "pt-br", label: "PT.BR" },
                                    { value: "en-us", label: "EN.US" },
                                ]}
                            />

                            {/* ── Botão de play de áudio — igual ao Figma (node 28:22) ── */}
                            <AudioWaveButton
                                playing={audioPlaying}
                                onToggle={onAudioToggle}
                                lang={lang}
                            />
                        </m.div>
                    </m.div>

                    {/* ── Coluna direita: card de metadata rotacionado ── */}
                    <m.div
                        className="relative shrink-0 w-[340px] h-[360px] hidden md:flex items-center justify-center"
                        variants={reduced ? undefined : vScaleIn}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        transition={{ ...sGentle, delay: 0.3 }}
                    >
                        {/* Círculo decorativo rosa — blur forte, expande no hover do card */}
                        <m.div
                            className="absolute rounded-full bg-[#FA2F93] pointer-events-none"
                            style={{ filter: "blur(40px)" }}
                            initial={{ width: 200, height: 200, opacity: 0.25 }}
                            whileHover={{ width: 320, height: 320, opacity: 0.35, filter: "blur(60px)" }}
                            transition={{ type: "spring", stiffness: 160, damping: 22 }}
                        />

                        {/* Card principal — levemente rotacionado */}
                        <m.div
                            className="relative z-10 bg-white rounded-[20px] p-5 flex flex-col gap-5 shadow-xl w-[280px]"
                            style={{ rotate: "4.54deg" }}
                            whileHover={reduced ? {} : { rotate: "2deg", y: -4, transition: sSnap }}
                        >
                            {/* Três bolinhas (macOS style) */}
                            <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                            </div>

                            {/* Papel */}
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-medium tracking-widest uppercase text-[#797F88]">
                                    {lang === "pt-br" ? "Papel" : "Role"}
                                </p>
                                <p className="text-sm font-bold text-[#19202B] leading-snug">
                                    Product Designer lead · end to end
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-medium tracking-widest uppercase text-[#797F88]">Timeline</p>
                                <div className="text-sm font-bold text-[#19202B] leading-snug">
                                    {lang === "pt-br" ? (
                                        <>
                                            <p>Do discovery ao MVP em 3 meses</p>
                                            <p>2 anos de produto em produção</p>
                                            <p>Atualmente em v3.1</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>From discovery to MVP in 3 months</p>
                                            <p>2 years of product in production</p>
                                            <p>Currently at v3.1</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-medium tracking-widest uppercase text-[#797F88]">Skills</p>
                                <p className="text-sm font-bold text-[#19202B]">UI/UX · Design System · Figma</p>
                            </div>
                        </m.div>
                    </m.div>

                </div>
            </div>

        </section >
    );
};

// ─── Section 1 — Evolução do produto (v1 → v2 → V3) ───────────────────────────
// Imagem full-width sobre fundo escuro mostrando as 3 gerações do HDrive.
const ProductEvolutionSection = () => {
    const reduced = useReducedMotion();
    return (
        <m.section
            className="w-full overflow-hidden"
            variants={reduced ? undefined : vScaleIn}
            initial={reduced ? false : "hidden"}
            whileInView="visible"
            transition={{ ...sGentle, delay: 0.1 }}
            viewport={{ once: true, margin: "-80px" }}
        >
            <img
                src="/images/housi-drive/hero-mockup.webp"
                alt="Evolução do HDrive — v1, v2 e V3 em perspectiva"
                className="w-full object-cover block"
            />
        </m.section>
    );
};

// ─── Sec 2 — O Problema ────────────────────────────────────────────────────────
const ProblemSection = ({ lang }) => {
    const t = T[lang] ?? T["pt-br"];
    return (
    <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col gap-10">

            {/* Título + descrição intro */}
            <FadeUp className="max-w-[650px] flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#FA2F93]">
                        {t.sec2Label}
                    </p>
                    <h2 className="text-[40px] font-bold text-[#19202B] leading-[1.4] tracking-tight">
                        {t.sec2Title}
                    </h2>
                </div>
                <div className="text-[20px] text-[#2E3744] leading-[1.4] font-medium">
                    <p>{t.sec2Intro1}</p>
                    <p>{t.sec2Intro2}</p>
                </div>
            </FadeUp>

            {/* Cards lado-a-lado */}
            <m.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                variants={vStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                {/* Card — lado do cliente */}
                <m.div
                    variants={vFadeUp}
                    transition={sSnap}
                    className="bg-[#F9FAFA] rounded-[12px] p-6 flex flex-col gap-6"
                >
                    <span className="self-start border-2 border-[#A893FC] text-[#5C29EF] text-xs font-semibold uppercase tracking-widest rounded-full px-3 py-1">
                        {t.sec2BadgeClient}
                    </span>
                    <div className="text-[18px] text-[#2E3744] leading-[1.4] font-medium space-y-3">
                        <p>{t.sec2Client1}</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            {t.sec2ClientList.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                        <p>{t.sec2Client2}</p>
                    </div>
                </m.div>

                {/* Card — lado do negócio */}
                <m.div
                    variants={vFadeUp}
                    transition={sSnap}
                    className="bg-[#F9FAFA] rounded-[12px] p-6 flex flex-col gap-6"
                >
                    <span className="self-start border-2 border-[#FFA1D5] text-[#FA2F93] text-xs font-semibold uppercase tracking-widest rounded-full px-3 py-1">
                        {t.sec2BadgeBiz}
                    </span>
                    <div className="text-[18px] text-[#2E3744] leading-[1.4] font-medium space-y-3">
                        <p>{t.sec2Biz1}</p>
                        <p>{t.sec2Biz2}</p>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-widest text-[#4D5560]">
                        {t.sec2BizNote}
                    </p>
                </m.div>
            </m.div>

        </div>
    </section>
    );
};

// ─── Sec 3 — A Solução ─────────────────────────────────────────────────────────
// Assets do Figma (válidos por 7 dias)
const SEC3_ASSETS = {
    dot: "/images/housi-drive/dot.svg",
    mapaVisual: "/images/housi-drive/mapa-visual.webp",
    formularios: "/images/housi-drive/formularios.webp",
    flexLeft: "/images/housi-drive/flex-left.webp",
    flexRight: "/images/housi-drive/flex-right.webp",
    cadastro: "/images/housi-drive/cadastro.webp",
};

// Sub-componente: card feature (texto esq + imagem dir)
const FeatureCard = ({ dot, title, description, footer, image, imgAlt, imgBg = "#fff", children }) => (
    <FadeUp className="border border-[#A9ADB2] rounded-[12px] overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Coluna texto */}
        <div className="flex flex-col gap-5 p-6 w-full md:w-[51%] shrink-0">
            <div className="flex gap-4 items-start">
                {dot && (
                    <div className="relative w-3 h-5 shrink-0 mt-1">
                        <img src={dot} alt="" className="absolute inset-0 w-full h-full object-contain" />
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    <h3 className="text-[22px] font-bold text-[#2E3744] leading-[1.3]">{title}</h3>
                    <div className="text-[18px] text-[#2E3744] leading-[1.4] font-medium space-y-3">
                        {description}
                    </div>
                </div>
            </div>
            {footer && (
                <p className="text-xs font-medium uppercase tracking-widest text-[#4D5560] pl-7">
                    {footer}
                </p>
            )}
        </div>
        {/* Coluna imagem */}
        <div
            className="border-l-2 border-[#D2D4D7] relative overflow-hidden flex-1 min-h-[280px]"
            style={{ background: imgBg }}
        >
            {children || (
                <img src={image} alt={imgAlt} className="absolute inset-0 w-full h-full object-cover" />
            )}
        </div>
    </FadeUp>
);

const SolutionSection = ({ lang }) => {
    const t = T[lang] ?? T["pt-br"];
    return (
    <section className="bg-[#F9FAFB] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col gap-10">

            {/* Título intro */}
            <FadeUp className="max-w-[650px] flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#FA2F93]">{t.sec3Label}</p>
                    <h2 className="text-[40px] font-bold text-[#19202B] leading-[1.4] tracking-tight">{t.sec3Title}</h2>
                </div>
                <div className="text-[20px] text-[#2E3744] leading-[1.4] font-medium space-y-1">
                    <p>{t.sec3Intro1}</p>
                    <p>{t.sec3Intro2}</p>
                    <p className="font-bold text-[#FA2F93] text-[16px] uppercase tracking-widest pt-2">
                        {t.sec3IntroTag}
                    </p>
                </div>
            </FadeUp>

            {/* Feature cards */}
            <div className="flex flex-col gap-6">

                {/* 1 — Mapa visual */}
                <FeatureCard
                    dot={SEC3_ASSETS.dot}
                    title={t.sec3F1Title}
                    description={
                        <>
                            <p>{t.sec3F1P1}</p>
                            <p>{t.sec3F1P2}</p>
                            <p><strong>{t.sec3F1P3}</strong></p>
                        </>
                    }
                    imgAlt="Visual map — project timeline"
                >
                    <img
                        src={SEC3_ASSETS.mapaVisual}
                        alt="Visual map — project timeline"
                        className="absolute inset-0 w-full h-full object-cover object-left-top"
                    />
                </FeatureCard>

                {/* 2 — Formulários e uploads */}
                <FeatureCard
                    dot={SEC3_ASSETS.dot}
                    title={t.sec3F2Title}
                    description={
                        <>
                            <p>{t.sec3F2P1}</p>
                            <p>{t.sec3F2P2}</p>
                            <p>{t.sec3F2P3}</p>
                        </>
                    }
                    image={SEC3_ASSETS.formularios}
                    imgAlt="Forms and uploads per sub-phase"
                />

                {/* 3 — Projetos flexíveis */}
                <FeatureCard
                    dot={SEC3_ASSETS.dot}
                    title={t.sec3F3Title}
                    description={<p>{t.sec3F3P}</p>}
                    footer={t.sec3F3Footer}
                    imgBg="#E3E3E3"
                >
                    {/* Duas imagens sobrepostas — coordenadas do Figma */}
                    <img
                        src={SEC3_ASSETS.flexLeft}
                        alt="Flexible phases — left"
                        className="absolute max-w-none pointer-events-none"
                        style={{ height: "203.28%", width: "57.94%", left: "1.12%", top: "6.45%" }}
                    />
                    <img
                        src={SEC3_ASSETS.flexRight}
                        alt="Flexible phases — right"
                        className="absolute max-w-none pointer-events-none"
                        style={{ height: "168.7%", width: "57.94%", left: "59.1%", top: "-53.68%" }}
                    />
                </FeatureCard>

                {/* 4 — Cadastro automático */}
                <FeatureCard
                    dot={SEC3_ASSETS.dot}
                    title={t.sec3F4Title}
                    description={<p>{t.sec3F4P}</p>}
                    footer={t.sec3F4Footer}
                    imgBg="#F8F8FC"
                >
                    <img
                        src={SEC3_ASSETS.cadastro}
                        alt="New project creation modal"
                        className="absolute max-w-none pointer-events-none"
                        style={{ height: "121.77%", width: "86%", left: "7%", top: "0.04%" }}
                    />
                </FeatureCard>

            </div>
        </div>
    </section>
    );
};

// ─── Sec 4 — Pesquisas e descobertas ───────────────────────────────────────────
const SEC4_ASSETS = {
    folderImage1: "/images/housi-drive/folder-image1.webp",
};

const ResearchSection = ({ lang }) => {
    const t = T[lang] ?? T["pt-br"];
    return (
    <section className="py-20 bg-white">
        <div className="px-6 flex flex-col gap-[37px] items-center">

            {/* Texto — Process Content */}
            <FadeUp className="flex flex-col gap-[27px] items-start w-full max-w-[650px]">
                {/* Label + Título */}
                <div className="flex flex-col gap-[8px] w-full leading-[1.4]">
                    <p className="font-semibold text-[#FA2F93] text-[14px] tracking-[0.168px] uppercase">
                        {t.sec4Label}
                    </p>
                    <h2 className="font-bold text-[#19202B] text-[40px] tracking-[0.48px] leading-[1.4]">
                        {t.sec4Title}
                    </h2>
                </div>
                {/* Corpo */}
                <div className="font-medium text-[#2E3744] text-[20px] tracking-[0.24px] w-full">
                    <p className="leading-[1.4] mb-0">{t.sec4P1}</p>
                    <p className="leading-[1.4] mb-0">{t.sec4P2}</p>
                    <p className="leading-[1.4]">
                        <strong className="font-bold">{t.sec4P3Bold}</strong>
                        {t.sec4P3}
                    </p>
                </div>
            </FadeUp>

            {/* Folder Mapping Images — altura fixa 352px, lado a lado */}
            <m.div
                className="flex gap-[24px] w-full max-w-[1040px]"
                style={{ height: "352px" }}
                variants={vFadeUp}
                initial="hidden"
                whileInView="visible"
                transition={sSnap}
                viewport={{ once: true, margin: "-60px" }}
            >
                {/* Imagem 1 — recorte superior */}
                <div className="border-2 border-[#2f2f2f] flex-1 rounded-[8px] overflow-hidden relative">
                    <img
                        src={SEC4_ASSETS.folderImage1}
                        alt="Folder mapping — top structure"
                        className="absolute left-0 w-full"
                        style={{ top: "0.07%", height: "162.03%" }}
                    />
                </div>
                {/* Imagem 2 — recorte inferior */}
                <div className="border-2 border-[#2f2f2f] flex-1 rounded-[8px] overflow-hidden relative">
                    <img
                        src={SEC4_ASSETS.folderImage1}
                        alt="Folder mapping — bottom structure"
                        className="absolute left-0 w-full"
                        style={{ top: "-61.91%", height: "162.03%" }}
                    />
                </div>
            </m.div>

            {/* Legenda 1 */}
            <FadeUp>
                <p className="font-medium text-[#4D5560] text-[16px] text-center tracking-[0.672px] uppercase leading-[1.4] max-w-[648px]">
                    {t.sec4Caption1}
                </p>
            </FadeUp>

            {/* Legenda 2 */}
            <FadeUp>
                <p className="font-medium text-[#4D5560] text-[16px] text-center tracking-[0.672px] uppercase leading-[1.4] max-w-[648px]">
                    {t.sec4Caption2}
                </p>
            </FadeUp>

        </div>
    </section>
    );
};

// ─── Sec 5 — Arquitetura do MVP ─────────────────────────────────────────────────
const SEC5_ASSETS = {
    colaboradorDot: "/images/housi-drive/colaborador-dot.svg",
    clienteDot: "/images/housi-drive/cliente-dot.svg",
};

const InfoArchSection = ({ lang }) => {
    const t = T[lang] ?? T["pt-br"];
    return (
    <section className="py-20 bg-[#F9FAFB]">
        <div className="px-6 flex flex-col gap-[40px] items-center">

            {/* Título + texto intro */}
            <FadeUp className="flex flex-col gap-[27px] items-start w-full max-w-[650px]">
                <div className="flex flex-col gap-[8px] w-full leading-[1.4]">
                    <p className="font-semibold text-[#FA2F93] text-[14px] tracking-[0.168px] uppercase">
                        {t.sec5Label}
                    </p>
                    <h2 className="font-bold text-[#19202B] text-[40px] tracking-[0.48px] leading-[1.4]">
                        {t.sec5Title}
                    </h2>
                </div>
                <div className="font-medium text-[#2E3744] text-[20px] tracking-[0.24px] w-full">
                    <p className="leading-[1.4] mb-0">
                        {t.sec5P1.split("\n").map((line, i) => (
                            <span key={i}>{line}{i === 0 && <br />}</span>
                        ))}
                    </p>
                    <p className="leading-[1.4]">
                        {t.sec5P2}
                    </p>
                </div>
            </FadeUp>

            {/* Dois fluxos lado a lado */}
            <m.div
                className="grid grid-cols-1 md:grid-cols-2 gap-[53px] w-full max-w-[1007px]"
                variants={vStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                {/* ── Coluna Negócio / Colaborador Housi ── */}
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col gap-[20px]">

                    {/* Header */}
                    <div className="bg-[#4D5560] rounded-[12px] px-[24px] py-[12px] flex gap-[20px] items-center">
                        <div className="relative w-[12px] h-[20px] shrink-0">
                            <img src={SEC5_ASSETS.colaboradorDot} alt="" className="absolute inset-0 w-full h-full object-contain" />
                        </div>
                        <p className="font-bold text-white text-[20px] tracking-[0.24px] leading-[1.4]">
                            {t.sec5ColBizHeader}
                        </p>
                    </div>

                    {/* Acessa a plataforma */}
                    <div className="border border-[#A9ADB2] rounded-[12px] p-[24px] flex flex-col gap-[12px] leading-[1.4]">
                        <p className="font-bold text-[#FA2F93] text-[16px] tracking-[0.192px] uppercase">{t.sec5ColBiz1Title}</p>
                        <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">{t.sec5ColBiz1P}</p>
                    </div>

                    {/* Consome Dashboard */}
                    <div className="border border-[#A9ADB2] rounded-[12px] p-[24px] flex flex-col gap-[12px] leading-[1.4]">
                        <p className="font-bold text-[#FA2F93] text-[16px] tracking-[0.192px] uppercase">{t.sec5ColBiz2Title}</p>
                        <div className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                            <p className="mb-0">{t.sec5ColBiz2P1}</p>
                            <p>{t.sec5ColBiz2P2}</p>
                        </div>
                    </div>

                    {/* + Novo projeto — dashed */}
                    <div className="bg-white border-2 border-dashed border-[#FA2F93] rounded-[12px] p-[24px] flex flex-col gap-[12px] leading-[1.4]">
                        <p className="font-bold text-[#FA2F93] text-[16px] tracking-[0.192px] uppercase">{t.sec5ColBiz3Title}</p>
                        <div className="font-medium text-[#2E3744] text-[16px] tracking-[0.192px]">
                            <p className="mb-0">{t.sec5ColBiz3Pre}</p>
                            {t.sec5ColBiz3List.map((item, i) => (
                                <p key={i} className="mb-0">{item}</p>
                            ))}
                        </div>
                        <p className="font-bold text-[#2E3744] text-[16px] tracking-[0.192px]">{t.sec5ColBiz3Confirm}</p>
                    </div>

                    {/* Ação automática — rosa claro */}
                    <div className="bg-[#FEF1F8] border border-[#A9ADB2] rounded-[12px] p-[24px] flex flex-col gap-[12px]">
                        <p className="font-bold text-[#FA2F93] text-[16px] tracking-[0.192px] uppercase leading-[1.4]">{t.sec5ColBizAutoTitle}</p>
                        <ul className="list-disc font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                            {t.sec5ColBizAutoList.map((item, i) => (
                                <li key={i} className="mb-0 ml-[27px] leading-[1.4]">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Monitoramento */}
                    <div className="border border-[#A9ADB2] rounded-[12px] p-[24px] flex flex-col gap-[12px]">
                        <p className="font-bold text-[#FA2F93] text-[16px] tracking-[0.192px] uppercase leading-[1.4]">{t.sec5ColBizMonTitle}</p>

                        {/* Sub-card Etapas */}
                        <div className="border border-[#FA2F93] rounded-[8px] p-[12px] flex flex-col gap-[12px] opacity-80">
                            <p className="font-bold text-[#FA2F93] text-[12px] tracking-[0.144px] uppercase leading-[1.4]">{t.sec5ColBizEtapasTitle}</p>
                            <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4]">{t.sec5ColBizEtapasP}</p>
                            <ul className="list-disc font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                                {t.sec5ColBizEtapasList.map((item, i) => (
                                    <li key={i} className="mb-0 ml-[27px] leading-[1.4]">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Sub-card Uploads */}
                        <div className="border border-[#FA2F93] rounded-[8px] p-[12px] flex flex-col gap-[12px] opacity-80">
                            <p className="font-bold text-[#FA2F93] text-[12px] tracking-[0.144px] uppercase leading-[1.4]">{t.sec5ColBizUpTitle}</p>
                            <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4]">{t.sec5ColBizUpP}</p>
                        </div>

                        {/* Sub-card Conclusão */}
                        <div className="border border-[#FA2F93] rounded-[8px] p-[12px] flex flex-col gap-[12px] opacity-80">
                            <p className="font-bold text-[#FA2F93] text-[12px] tracking-[0.144px] uppercase leading-[1.4]">{t.sec5ColBizConclTitle}</p>
                            <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4]">{t.sec5ColBizConclP}</p>
                        </div>

                        <p className="font-bold text-[#FA2F93] text-[16px] tracking-[0.192px] uppercase text-center leading-[1.4]">{t.sec5ColBizCycle}</p>
                    </div>

                </m.div>

                {/* ── Coluna Cliente / Incorporadoras ── */}
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col gap-[20px]">

                    {/* Header */}
                    <div className="bg-[#E5D9FE] rounded-[12px] px-[24px] py-[12px] flex gap-[20px] items-center">
                        <div className="relative w-[12px] h-[20px] shrink-0">
                            <img src={SEC5_ASSETS.clienteDot} alt="" className="absolute inset-0 w-full h-full object-contain" />
                        </div>
                        <p className="font-bold text-[#5C29EF] text-[20px] tracking-[0.24px] leading-[1.4]">
                            {t.sec5ColClientHeader}
                        </p>
                    </div>

                    {/* Email de primeiro acesso */}
                    <div className="bg-[#F9F5FF] border border-[#A9ADB2] rounded-[12px] p-[24px] flex flex-col gap-[12px] leading-[1.4]">
                        <p className="font-bold text-[#5C29EF] text-[16px] tracking-[0.192px] uppercase">{t.sec5ColClient1Title}</p>
                        <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                            {t.sec5ColClient1P}
                        </p>
                    </div>

                    {/* Meus Projetos */}
                    <div className="border border-[#A9ADB2] rounded-[12px] p-[24px] flex flex-col gap-[12px] leading-[1.4]">
                        <p className="font-bold text-[#5C29EF] text-[16px] tracking-[0.192px] uppercase">{t.sec5ColClient2Title}</p>
                        <div className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                            <p className="mb-0">{t.sec5ColClient2P1}</p>
                            <p className="mb-0">{t.sec5ColClient2P2}</p>
                            <p className="mb-0">{t.sec5ColClient2P3}</p>
                            <p>{t.sec5ColClient2P4}</p>
                        </div>
                    </div>

                    {/* Interagindo com o projeto — dashed roxo */}
                    <div className="bg-white border-2 border-dashed border-[#5C29EF] rounded-[12px] p-[24px] flex flex-col gap-[12px]">
                        <p className="font-bold text-[#5C29EF] text-[16px] tracking-[0.192px] uppercase leading-[1.4]">{t.sec5ColClient3Title}</p>

                        {/* Sub-card Preenchendo informações */}
                        <div className="border border-[#725DF4] rounded-[8px] p-[12px] flex flex-col gap-[12px] opacity-80">
                            <p className="font-bold text-[#5C29EF] text-[12px] tracking-[0.144px] uppercase leading-[1.4]">{t.sec5ColClient3ATitle}</p>
                            <p className="font-bold text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4]">{t.sec5ColClient3ABold}</p>
                            <ul className="list-disc font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                                {t.sec5ColClient3AList.map((item, i) => (
                                    <li key={i} className="mb-0 ml-[27px] leading-[1.4]">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Sub-card Upload */}
                        <div className="border border-[#725DF4] rounded-[8px] p-[12px] flex flex-col gap-[12px] opacity-80">
                            <p className="font-bold text-[#5C29EF] text-[12px] tracking-[0.144px] uppercase leading-[1.4]">{t.sec5ColClient3BTitle}</p>
                            <p className="font-bold text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4]">{t.sec5ColClient3BBold}</p>
                            <ul className="list-disc font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                                {t.sec5ColClient3BList.map((item, i) => (
                                    <li key={i} className="mb-0 ml-[27px] leading-[1.4]">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Sub-card Consome arquivos */}
                        <div className="border border-[#725DF4] rounded-[8px] p-[12px] flex flex-col gap-[12px] opacity-80">
                            <p className="font-bold text-[#5C29EF] text-[12px] tracking-[0.144px] uppercase leading-[1.4]">{t.sec5ColClient3CTitle}</p>
                            <p className="font-bold text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4]">{t.sec5ColClient3CBold}</p>
                            <ul className="list-disc font-medium text-[#2E3744] text-[18px] tracking-[0.216px]">
                                {t.sec5ColClient3CList.map((item, i) => (
                                    <li key={i} className="mb-0 ml-[27px] leading-[1.4]">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </m.div>
            </m.div>

        </div>
    </section>
    );
};

// ─── Sec 6 — Resultados ─────────────────────────────────────────────────────────
const ResultsSection = ({ lang }) => {
    const t = T[lang] ?? T["pt-br"];
    return (
    <section className="py-[60px] bg-white">
        <div className="px-6 flex flex-col gap-[40px] items-center">

            {/* Título + texto */}
            <FadeUp className="flex flex-col gap-[20px] items-start w-full max-w-[650px]">
                <div className="flex flex-col gap-[8px] w-full leading-[1.4]">
                    <p className="font-semibold text-[#FA2F93] text-[14px] tracking-[0.168px] uppercase">
                        {t.sec6Label}
                    </p>
                    <h2 className="font-bold text-[#19202B] text-[40px] tracking-[0.48px] leading-[1.4]">
                        {t.sec6Title}
                    </h2>
                </div>
                <p className="font-medium text-[#2E3744] text-[20px] tracking-[0.24px] leading-[1.4]">
                    {t.sec6P}
                </p>
            </FadeUp>

            {/* Métricas — 3 colunas */}
            <m.div
                className="flex flex-col md:flex-row gap-[40px] items-start w-full max-w-[900px]"
                variants={vStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col gap-[8px] items-start">
                    <p className="font-bold text-[#FA2F93] text-[40px] tracking-[0.48px] uppercase leading-[1.4]">{t.sec6M1Value}</p>
                    <div className="flex flex-col gap-[4px]">
                        <p className="font-bold text-[#2E3744] text-[24px] tracking-[0.288px] leading-[1.4]">{t.sec6M1Title}</p>
                        <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4] max-w-[278px]">{t.sec6M1P}</p>
                    </div>
                </m.div>
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col gap-[8px] items-start">
                    <p className="font-bold text-[#FA2F93] text-[40px] tracking-[0.48px] uppercase leading-[1.4]">{t.sec6M2Value}</p>
                    <div className="flex flex-col gap-[4px]">
                        <p className="font-bold text-[#2E3744] text-[24px] tracking-[0.288px] leading-[1.4]">{t.sec6M2Title}</p>
                        <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4] max-w-[278px]">{t.sec6M2P}</p>
                    </div>
                </m.div>
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col gap-[8px] items-start">
                    <p className="font-bold text-[#FA2F93] text-[40px] tracking-[0.48px] uppercase leading-[1.4]">{t.sec6M3Value}</p>
                    <div className="flex flex-col gap-[4px]">
                        <p className="font-bold text-[#2E3744] text-[24px] tracking-[0.288px] leading-[1.4]">{t.sec6M3Title}</p>
                        <p className="font-medium text-[#2E3744] text-[18px] tracking-[0.216px] leading-[1.4] max-w-[277px]">{t.sec6M3P}</p>
                    </div>
                </m.div>
            </m.div>

        </div>
    </section>
    );
};

// ─── Sec 7 — Meu papel + Aprendizados ──────────────────────────────────────────
const RoleSection = ({ lang }) => {
    const t = T[lang] ?? T["pt-br"];
    return (
    <section className="py-[60px] bg-[#F9FAFB]">
        <div className="px-6 flex flex-col gap-[40px] items-center">

            {/* Meu papel */}
            <FadeUp className="flex flex-col gap-[20px] items-start w-full max-w-[650px]">
                <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-semibold text-[#FA2F93] text-[14px] tracking-[0.168px] uppercase leading-[1.4]">
                        {t.sec7Label}
                    </p>
                    <h2 className="font-bold text-[#19202B] text-[40px] tracking-[0.48px] leading-[1.4]">
                        {t.sec7Title}
                    </h2>
                </div>
                <div className="font-medium text-[#2E3744] text-[20px] tracking-[0.24px] w-full">
                    <p className="leading-[1.4] mb-0">{t.sec7P1}</p>
                    <p className="leading-[1.4] mb-0">{t.sec7P2}</p>
                    <p className="leading-[1.4] mb-0">{t.sec7P3}</p>
                    <p className="leading-[1.4]">{t.sec7P4}</p>
                </div>
            </FadeUp>

            {/* Aprendizados */}
            <FadeUp className="flex flex-col gap-[20px] items-start w-full max-w-[650px] pt-[40px]">
                <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-semibold text-[#FA2F93] text-[14px] tracking-[0.168px] uppercase leading-[1.4]">
                        {t.sec7LearLabel}
                    </p>
                    <h2 className="font-bold text-[#19202B] text-[40px] tracking-[0.48px] leading-[1.4]">
                        {t.sec7LearTitle}
                    </h2>
                </div>
                <p className="font-medium text-[#2E3744] text-[20px] tracking-[0.24px] leading-[1.4] w-full">
                    {t.sec7LearP}
                </p>
            </FadeUp>

        </div>
    </section>
    );
};

// ─── Sec 8 — Product Showcase (Bento Grid) ─────────────────────────────────────
const SEC8_ASSETS = {
    img1: "/images/housi-drive/img1.webp",
    img2: "/images/housi-drive/img2.webp",
    img3: "/images/housi-drive/img3.webp",
    img4: "/images/housi-drive/img4.webp",
    img5: "/images/housi-drive/img5.webp",
    img6: "/images/housi-drive/img6.webp",
    img7: "/images/housi-drive/img7.webp",
    img8: "/images/housi-drive/img8.webp",
    img9: "/images/housi-drive/img9.webp",
};

const BentoImg = ({ src, alt, className = "" }) => (
    <m.div
        className={`overflow-hidden rounded-[12px] ${className}`}
        style={{ boxShadow: "0px 10px 15px rgba(0,0,0,0.05)" }}
        whileHover={{ scale: 1.02, transition: sSnap }}
    >
        <img src={src} alt={alt} className="w-full h-full object-cover block" loading="lazy" />
    </m.div>
);

const ShowcaseSection = ({ lang }) => {
    const t = T[lang] ?? T["pt-br"];
    return (
    <section className="py-24 bg-[#6C727B]">
        <div className="px-6 max-w-[1200px] mx-auto space-y-10">

            {/* Header centralizado */}
            <FadeUp className="text-center space-y-2">
                <p className="text-xs uppercase tracking-widest text-white/60">{t.sec8Label}</p>
                <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-tight tracking-tight">
                    {t.sec8Title}
                </h2>
            </FadeUp>

            {/* Bento Grid */}
            <m.div
                className="space-y-6"
                variants={vStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                {/* Row 1: mobile → coluna; desktop → estreita + larga */}
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col md:flex-row md:h-[292px] gap-6">
                    <BentoImg
                        src={SEC8_ASSETS.img1}
                        alt="Tela Housi Drive — visão 1"
                        className="w-full h-[260px] md:w-[292px] md:h-full md:flex-shrink-0"
                    />
                    <BentoImg
                        src={SEC8_ASSETS.img2}
                        alt="Tela Housi Drive — visão 2"
                        className="w-full h-[260px] md:flex-1 md:h-full"
                    />
                </m.div>

                {/* Row 2: mobile → coluna; desktop → alta + coluna-dupla + imagem */}
                {/* h-[431px] fixo no row — alinha todas as colunas na mesma altura */}
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col md:flex-row md:h-[431px] gap-6">
                    <BentoImg
                        src={SEC8_ASSETS.img3}
                        alt="Tela Housi Drive — visão 3"
                        className="w-full h-[260px] md:flex-1 md:h-full"
                    />
                    {/* coluna dupla: ocupa 100% da altura do row e divide internamente */}
                    <div className="flex flex-col gap-6 md:w-[292px] md:flex-shrink-0 md:h-full">
                        <BentoImg
                            src={SEC8_ASSETS.img4}
                            alt="Tela Housi Drive — visão 4"
                            className="w-full h-[260px] md:flex-1 md:min-h-0"
                        />
                        <BentoImg
                            src={SEC8_ASSETS.img5}
                            alt="Tela Housi Drive — visão 5"
                            className="w-full h-[260px] md:flex-1 md:min-h-0"
                        />
                    </div>
                    <BentoImg
                        src={SEC8_ASSETS.img6}
                        alt="Tela Housi Drive — visão 6"
                        className="w-full h-[260px] md:w-[292px] md:h-full md:flex-shrink-0"
                    />
                </m.div>

                {/* Row 3: mobile → coluna; desktop → três imagens iguais */}
                <m.div variants={vFadeUp} transition={sSnap} className="flex flex-col md:flex-row md:h-[292px] gap-6">
                    <BentoImg src={SEC8_ASSETS.img7} alt="Tela Housi Drive — visão 7" className="w-full h-[260px] md:flex-1 md:h-full" />
                    <BentoImg src={SEC8_ASSETS.img8} alt="Tela Housi Drive — visão 8" className="w-full h-[260px] md:flex-1 md:h-full" />
                    <BentoImg
                        src={SEC8_ASSETS.img9}
                        alt="Tela Housi Drive — visão 9"
                        className="w-full h-[260px] md:flex-1 md:h-full"
                    />
                </m.div>
            </m.div>

        </div>
    </section>
    );
};

// ─── Footer ────────────────────────────────────────────────────────────────────
const PageFooter = ({ lang }) => {
    const navigate = useNavigate();
    const t = T[lang] ?? T["pt-br"];
    return (
        <footer className="py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                <span className="font-bold text-[#1A2E3B]">HDrive</span>
                <div className="flex gap-6">
                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer hover:text-[#1A2E3B] transition-colors duration-200"
                    >
                        {t.footerBack}
                    </button>
                    <a
                        href="#"
                        className="cursor-pointer hover:text-[#E91E8C] transition-colors duration-200 font-medium"
                    >
                        {t.footerNext}
                    </a>
                </div>
            </div>
        </footer>
    );
};

// ─── ScrollToTop — botão flutuante, mobile + desktop, aparece após scroll ───────
// audioBarVisible: quando true, sobe o botão para não ficar atrás da barra de áudio
const ScrollToTopButton = ({ audioBarVisible = false }) => {
    const [visible, setVisible] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // bottom: 8 normal → 80 quando a barra de áudio está aberta (72px de altura da barra + margem)
    const bottomOffset = audioBarVisible ? 80 : 8;

    return (
        <AnimatePresence>
            {visible && (
                <m.button
                    key="scroll-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex fixed right-4 md:right-8 z-50 w-11 h-11 rounded-full bg-white border border-[#E6E7E9] shadow-md items-center justify-center cursor-pointer hover:shadow-lg hover:border-[#FA2F93] group transition-colors duration-200"
                    style={{ bottom: bottomOffset }}
                    initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, bottom: bottomOffset }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    aria-label="Voltar ao topo"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.92 }}
                >
                    <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor"
                        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        className="text-[#4D5560] group-hover:text-[#FA2F93] transition-colors duration-200"
                    >
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </m.button>
            )}
        </AnimatePresence>
    );
};

// ─── Root — LazyMotion wrappa tudo (bundle-dom-animation CRITICAL) ────────────
// domAnimation: 17kb menor que domMax, cobre 100% do que usamos aqui
// (animate, whileInView, whileHover, whileTap, spring). domMax só seria
// necessário se usássemos layout animations ou drag — não é o caso.
//
// viewMode "resumo"    → mostra apenas Hero + ProductEvolution + Problem + Solution + Results + Showcase + Footer
// viewMode "detalhado" → mostra todas as seções, incluindo Research, InfoArch e Role
const HouiDrivePage = () => {
    const [viewMode, setViewMode] = useState("detalhado");
    const [lang, setLang] = useState("pt-br");
    const heroRef = useRef(null);

    // ── Áudio — estado centralizado usando o hook ──
    const {
        playing: audioPlaying,
        hasStarted: audioHasStarted,
        toggle: toggleAudio,
        dismiss: dismissAudio,
        progress: audioProgress,
        currentTime: audioCurrentTime,
        duration: audioDuration,
        seek: audioSeek,
    } = useAudioPlayer("/audio/hdrive-presentation.wav");

    return (
        <LazyMotion features={domAnimation}>
            <div className="bg-white font-sans text-base antialiased pb-20">
                <Navbar
                    lang={lang}
                    viewMode={viewMode}
                    onModeChange={setViewMode}
                    onLangChange={setLang}
                    heroRef={heroRef}
                />
                <div ref={heroRef}>
                    <Hero
                        viewMode={viewMode}
                        onModeChange={setViewMode}
                        lang={lang}
                        onLangChange={setLang}
                        audioPlaying={audioPlaying}
                        onAudioToggle={toggleAudio}
                    />
                </div>
                {/* AnimatePresence mode="wait" — espera o exit terminar antes de montar o enter */}
                {/* key muda quando o viewMode muda → dispara exit/enter em todo o bloco de conteúdo */}
                <AnimatePresence mode="wait">
                    <m.div
                        key={viewMode}
                        variants={vPageSwitch}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {viewMode === "detalhado" && <ProductEvolutionSection />}
                        <ProblemSection lang={lang} />
                        <SolutionSection lang={lang} />
                        {viewMode === "detalhado" && <ResearchSection lang={lang} />}
                        {viewMode === "detalhado" && <InfoArchSection lang={lang} />}
                        <ResultsSection lang={lang} />
                        {viewMode === "detalhado" && <RoleSection lang={lang} />}
                        <ShowcaseSection lang={lang} />
                        <PageFooter lang={lang} />
                    </m.div>
                </AnimatePresence>
                <ScrollToTopButton audioBarVisible={audioHasStarted} />

                {/* ── Navbar inferior de áudio — só exibe após o primeiro play ── */}
                <AudioPlayerBar
                    visible={audioHasStarted}
                    playing={audioPlaying}
                    onToggle={toggleAudio}
                    onDismiss={dismissAudio}
                    progress={audioProgress}
                    currentTime={audioCurrentTime}
                    duration={audioDuration}
                    onSeek={audioSeek}
                />
            </div>
        </LazyMotion>
    );
};

export default HouiDrivePage;
