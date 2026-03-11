# Housi Drive — Case V3

---

## Título

**Substituí WhatsApp, e-mail e Excel de uma proptech — e hoje 340 projetos imobiliários são gerenciados em um único lugar.**

---

## Contexto

A Housi é uma proptech brasileira que oferece tecnologia predial, arquitetura e expertise em vendas para incorporadoras. Cada contrato é customizado — e cada projeto percorre um ciclo longo, da assinatura até a entrega das chaves.

| | |
|---|---|
| **Produto** | Plataforma B2B de backoffice (intranet) |
| **Plataforma** | Web desktop-first (1440px) |
| **Meu papel** | UX Designer — design end-to-end |
| **Duração** | V1 entregue em 6 meses · produto em evolução até v3.0 |
| **Status** | Em operação — 340 projetos ativos · março de 2026 |

---

## O Problema

### Do lado do usuário (incorporadoras)

As incorporadoras não tinham como acompanhar em que etapa seu projeto estava. Para suprir a lacuna, colaboradores da Housi produziam **mapas visuais manualmente em PowerPoint** e enviavam individualmente — um processo que não escalava e dependia de cada pessoa querer (e lembrar) de enviar.

### Do lado do negócio

Toda a informação sobre cada projeto vivia em uma única pessoa. Arquivos trafegavam por e-mail e WhatsApp ao longo de meses, sem padrão, sem rastreabilidade — e se perdiam com o tempo. Crescer significava aumentar o risco operacional, porque não havia base estruturada, só memória individual.

---

## A Solução

Dois ambientes conectados — um para o time interno da Housi, outro para as incorporadoras — organizados em torno de um mapa visual de cada projeto, com macro e micro-etapas, formulários, uploads de arquivos e um drive centralizado associado diretamente ao projeto.

**Trilha visual de progresso por etapas**
Cada projeto ganhou uma linha do tempo visual com 11 macro-etapas e 33 micro-etapas — cada uma com responsável definido (Housi ou incorporador), status e dependências. As incorporadoras passaram a ver, em tempo real, o que aconteceu e o que precisam fazer agora. O que antes dependia de um e-mail manual deixou de existir.
*→ Zero dependência do time Housi para que o cliente saiba onde o projeto está.*

**Formulários e uploads por subetapa — cada interação no formato certo**
Antes da plataforma, cada subetapa que exigia informação ou entrega de arquivo seguia o mesmo fluxo: o colaborador enviava por e-mail um modelo em Word ou Excel para a incorporadora preencher e devolver. Sem padrão, sem rastreabilidade — cada um resolvia do seu jeito. O mapeamento dessas trocas revelou dois padrões distintos: momentos que precisavam de informação estruturada (dados, aprovações, registros) e momentos que precisavam de entrega de arquivo (plantas em DWG, imagens, PDFs técnicos). A partir disso, cada subetapa foi desenhada com o modelo certo para ela — formulário com salvamento progressivo quando há dados a registrar, upload direto quando o que importa é o arquivo. Em ambos os casos, o conteúdo é organizado automaticamente na pasta da etapa correspondente; nos formulários, gera um PDF com o registro completo ao concluir.
*→ O que antes era e-mail com anexo virou interação estruturada — cada subetapa pede só o que precisa, no formato certo.*

**Cadastro modular por projeto — com toggles de etapas**
Como cada contrato é customizado, a plataforma reflete isso. O colaborador habilita ou desabilita etapas e subetapas individualmente por projeto, usando switches visuais. Simples, sem ambiguidade — e com efeito imediato na trilha que o cliente enxerga.
*→ Mais precisão na configuração de cada projeto, sem complexidade operacional.*

**Onboarding automático de clientes embutido no cadastro**
Ao cadastrar um novo projeto, o colaborador preenche o e-mail do cliente como campo obrigatório. O sistema valida, cria o acesso (se necessário) e dispara o e-mail de boas-vindas — o cliente chega à plataforma com o projeto já visível.
*→ O onboarding acontece como efeito colateral do que o colaborador já fazia.*

---

## Processo

**Mapeamento antes de qualquer tela**
Antes de abrir o Figma, documentei as 11 macro-etapas e suas micro-etapas em conversas diretas com os colaboradores operacionais — as pessoas que viviam o processo no dia a dia. Mapeei responsáveis, informações trocadas em cada momento e onde o fluxo travava com mais frequência. Esse mapeamento revelou que a dor principal não era visual: era de rastreabilidade e responsabilidade. Sem isso, teria construído uma interface bonita para o problema errado.

**Arquitetura de dois ambientes separados**
Decidir o que cada público via — e não via — foi tão importante quanto a interface. Trabalhei com fluxos separados por persona antes de qualquer wireframe: o ambiente do colaborador precisava de controle granular; o do cliente precisava ser autoexplicativo, sem jargão interno, com foco em "o que aconteceu" e "o que preciso fazer agora". Só depois de validar essa separação com o time de produto parti para os wireframes.

**Wireframes de baixa fidelidade para alinhar fluxo**
Desenhei os principais fluxos em wireframe antes de qualquer decisão visual — especialmente o cadastro de projetos e a trilha de etapas, que tinham maior complexidade de estados. Iterar em wireframe permitiu ajustar hierarquia e lógica de interação sem custo alto.

**Uma decisão de MVP deliberada**
A navegação de documentos foi simplificada intencionalmente: usei um componente pré-pronto de implementação rápida para lançar, validar a adesão ao fluxo central e só depois investir na experiência de documentos. O feedback real de uso foi o critério para priorizar o redesign — não hipótese.

**Evolução incremental por versões**
V1 → V2 → V3.0. Cada nova funcionalidade nasceu do uso real, com handoffs estruturados no Figma documentando contexto e decisões a cada entrega.

---

## Resultado

O Housi Drive substituiu um processo inteiramente manual e fragmentado por uma plataforma centralizada com rastreabilidade completa.

- **340 projetos cadastrados** — cada um com trilha de etapas, documentos e histórico centralizados
- **+80 incorporadoras** com acesso ao próprio ambiente, sem depender do time Housi para acompanhar o andamento
- **+8 colaboradores** operando no dia a dia, com visibilidade consolidada para a liderança — algo impossível antes sem consultar cada pessoa manualmente

Na v3.0, o produto expandiu para cobrir o ciclo completo: da assinatura do contrato à entrega das chaves, separado em duas fases claras — **Lançamento** e **Obras**. A maior adição foi a fase de Obras, que acompanha o período do início das obras até a entrega das chaves com a mesma lógica de trilha visual e responsabilidades.

**Aprendizado principal:** validaria o modelo de navegação de documentos com um protótipo antes do desenvolvimento. A decisão de usar componente pré-pronto foi correta para o prazo, mas chegamos ao limite dele antes de ter capacidade de redesenhar — um teste mais cedo teria antecipado a fricção que o usuário enfrentou por um período.

---

## Meu papel

Fui o designer responsável pelo produto do início ao fim. Conduzi as conversas com cada área envolvida no fluxo — operacional, produto e desenvolvimento — mapeei o processo, desenhei a solução, validei com os usuários e iterei com base no uso real. Negociei escopo e priorizações diretamente com produto e tech, e busquei ativamente junto aos desenvolvedores formas de otimizar a execução com uso de componentes reutilizáveis. A partir da V2, liderei a execução de um designer júnior que me auxiliou na operação do design — coordenando entregas, revisando trabalho e garantindo consistência com as decisões já estabelecidas.
