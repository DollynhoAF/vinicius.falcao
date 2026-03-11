# Instruções para Geração da Tela de Detalhes — Housi Drive

> Este arquivo é um prompt completo para uma IA construir a página de case do projeto **Housi Drive** como um componente React (`.jsx`). Leia todos os documentos desta pasta antes de gerar qualquer código.

---

## 1. Documentos de Referência

Você tem acesso aos seguintes arquivos nesta pasta:

| Arquivo | Função |
|---|---|
| `estructure.md` | Blueprint da estrutura da página — siga-o como esqueleto obrigatório |
| `housi-drive-case-v3.md` | Conteúdo real do case: título, contexto, problema, solução, processo e resultado |
| `imagens/` | Prints reais das interfaces do produto — use como mockups ao longo da página |

**Regra principal:** o `estructure.md` define *onde* cada coisa vai; o `housi-drive-case-v3.md` define *o quê* entra em cada lugar. As imagens são evidências visuais — distribua-as nas seções corretas conforme mapeado abaixo.

---

## 2. Mapeamento das Imagens por Seção

Use cada imagem **exatamente na seção indicada**. Não invente posições. Não omita imagens.

### Hero Section — Media Container
- **`imagens/Projetos v3.png`**
  - O que é: tela de detalhe de projeto na versão 3, com trilha de fases (Fase 1, Fase 2, Documentos) e listagem de sub-etapas com responsáveis, datas e ações.
  - Uso: imagem principal do hero — exibida dentro do container `bg-[#E8F4F4]` (tom de verde/teal claro, alinhado à identidade do HDrive) como mockup de desktop flutuante com sombra suave.

### Context Section — The Problem & Solution
- **`imagens/projetos v1 mvp.png`**
  - O que é: versão MVP (v1) da trilha de etapas — visual mais simples, linear, mostrando a evolução do pensamento.
  - Uso: ilustra o "antes" ou o ponto de partida da solução. Exiba como imagem secundária ao lado do texto do problema/solução.

### Research & Discovery
- **`imagens/mapeamento de arquivos.png`**
  - O que é: diagrama de hierarquia de pastas do projeto, com categorias como Onboarding, Assessoria de projetos, Projeto Decor, Estudo mercadológico, etc.
  - Uso: representa o processo de mapeamento das 11 macro-etapas feito antes de abrir o Figma. Use como o **Affinity Map Component** da seção de Research — um container com bordas suaves e fundo claro simulando a organização do levantamento de informações.

### Information Architecture — User Flow & Wireframes
- **`imagens/toggles novo projeto.png`**
  - O que é: tela de configuração de etapas de um novo projeto (passo 3/4 do cadastro), com switches/toggles para habilitar ou desabilitar etapas e sub-etapas individualmente por projeto.
  - Uso: **Wireframe Low-Fi** — exiba em escala de cinza (aplique `grayscale` via CSS/Tailwind) para mostrar a evolução do pensamento antes do visual final.

### High-Fidelity Showcase — Sequência de telas Full-Bleed

Exiba as imagens nesta ordem, intercaladas com descrições curtas extraídas do `housi-drive-case-v3.md`:

1. **`imagens/Clientes e projetos.png`**
   - O que é: tela de listagem de incorporadoras e projetos com busca, paginação e gestão de conta.
   - Descrição sugerida: *"Visibilidade consolidada — o time interno gerencia todas as incorporadoras em um único lugar, com acesso rápido a cada projeto."*

2. **`imagens/Upload .png`**
   - O que é: componente de upload de arquivos em dois estados — vazio (antes do envio) e preenchido (após anexar arquivos).
   - Descrição sugerida: *"Cada sub-etapa pede só o que precisa — upload direto para entregas de arquivo, no formato certo para cada momento."*

3. **`imagens/arquivos.png`**
   - O que é: drive centralizado de documentos por etapa do projeto, com listagem de arquivos, datas, responsáveis e ações de download.
   - Descrição sugerida: *"Um drive vivo — os arquivos se organizam automaticamente na pasta da etapa correspondente, com rastreabilidade completa."*

4. **`imagens/projeto criado mvp.png`**
   - O que é: modal de confirmação após criação de projeto, explicando que o cliente receberá um e-mail automático com acesso à plataforma.
   - Descrição sugerida: *"O onboarding acontece como efeito colateral — ao cadastrar o projeto, o cliente já recebe acesso sem nenhuma etapa extra."*

### Conclusão — Seção de Resultado
- **`imagens/NPS.png`**
  - O que é: modal de avaliação NPS do produto (escala de estrelas + escala 0–10 de recomendação), voltado para mobile.
  - Uso: exiba como imagem de encerramento — simboliza o ciclo completo do produto chegando ao usuário final e coletando feedback. Posicione centralizada, menor, como uma nota final visual antes das métricas de resultado.

---

## 3. Conteúdo por Seção

Extraia o texto diretamente do `housi-drive-case-v3.md`. Não invente frases. Use as seguintes âncoras:

### Hero
- **Título:** `Substituí WhatsApp, e-mail e Excel de uma proptech — e hoje 340 projetos imobiliários são gerenciados em um único lugar.`
- **Frase de impacto:** `Uma plataforma B2B que substituiu processos inteiramente manuais por rastreabilidade completa — do contrato à entrega das chaves.`
- **Metadata Grid (3 colunas):**
  - Role: `UX Designer — end-to-end`
  - Timeline: `V1 em 6 meses · em evolução até v3.0`
  - Tools: `Figma · Design System próprio · Framer Motion`

### Context Section
- Use os blocos **"O Problema"** (lado do usuário + lado do negócio) e **"A Solução"** do case.
- Layout: título à esquerda (`O Problema` / `A Solução`), parágrafos à direita.

### Research & Discovery
- Use o bloco **"Processo"** — especialmente o parágrafo "Mapeamento antes de qualquer tela".
- **User Persona Card:** crie uma persona fictícia coerente com o contexto:
  - Nome: **Ana Paula, Gerente de Incorporação**
  - Bio: *"Acompanha 4 projetos simultâneos e precisava ligar para o time Housi toda semana para saber o status de cada um."*
  - Frase de Destaque: *"Antes eu não sabia se o projeto estava atrasado ou se ninguém tinha me avisado."*

### Information Architecture
- Texto introdutório: use o trecho sobre **"Arquitetura de dois ambientes separados"** do case.
- Wireframes: use o trecho sobre **"Wireframes de baixa fidelidade para alinhar fluxo"**.

### Visual Design System
- **Paleta de cores** (extraída das imagens):
  - `#E91E8C` — Rosa primário (CTAs, destaques)
  - `#1A2E3B` — Azul escuro (textos, sidebar)
  - `#F5F5F5` — Cinza de fundo
  - `#22C55E` — Verde de status concluído
  - `#F59E0B` — Amarelo de status em andamento
- **Tipografia:** Inter — pesos 400, 500, 600, 700
- **Component Library:** exiba exemplos dos botões rosa (primário), ghost (secundário) e o componente de toggle/switch vistos nas imagens.

### High-Fidelity Showcase
- Use os blocos de cada funcionalidade da solução como descrições intercaladas entre as imagens full-bleed.

### Conclusão
- Use o bloco **"Resultado"** com as métricas: 340 projetos, +80 incorporadoras, +8 colaboradores.
- Use o **"Aprendizado principal"** como encerramento honesto do case.

---

## 4. Especificações Técnicas Obrigatórias

### Stack
- React (`.jsx`) com Tailwind CSS
- `framer-motion` para animações
- Imagens referenciadas por caminho relativo: `./imagens/nome-do-arquivo.png`

### Animações
Aplique em **cada seção principal**:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}
>
```

### Layout e Espaçamento
- Padding vertical entre seções: `py-32`
- Container central: `max-w-6xl mx-auto px-6`
- Grids responsivos: `grid-cols-1 md:grid-cols-2` ou `md:grid-cols-3`
- Imagens de interface: sempre com `rounded-3xl` e `shadow-xl`
- Imagens full-bleed: `w-full object-cover` sem padding lateral

### Navbar
- `fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100`
- Logo à esquerda: **HDrive** em `font-bold`
- Links à direita: `Voltar ao Portfólio` e `Próximo Case →`

### Responsividade
- Todos os grids de 2 e 3 colunas devem colapsar para 1 coluna em mobile
- Título do hero: `text-4xl md:text-7xl`
- Imagens full-bleed mantêm proporção em mobile

### Cor principal do projeto
Use `bg-[#E8F4F4]` no container do Hero Media (derivado do verde/teal do produto HDrive).

---

## 5. Estrutura de Arquivo Esperada

O output deve ser **um único arquivo `.jsx`** autocontido, sem dependências externas além de `framer-motion` e Tailwind. Salve como `HouiDrivePage.jsx` na raiz desta pasta.

---

## 6. Checklist de Validação

Antes de finalizar, verifique:

- [ ] Todas as 9 imagens foram utilizadas nas seções corretas
- [ ] Nenhum texto foi inventado — todo conteúdo vem do `housi-drive-case-v3.md`
- [ ] Animações `framer-motion` aplicadas em todas as seções
- [ ] Navbar fixa presente
- [ ] Metadata Grid com 3 colunas no Hero
- [ ] Persona Card com foto circular, bio e frase de destaque em itálico
- [ ] Paleta de cores exibida com círculos e códigos hex
- [ ] Imagens com `rounded-3xl`
- [ ] Layout responsivo (colapsa para 1 coluna em mobile)
- [ ] Arquivo salvo como `HouiDrivePage.jsx`
