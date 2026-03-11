# Project Detail Page — Estrutura de Componentes

## 1. Project Hero

### Header
- Navbar fixa e minimalista
- Logo à esquerda, links de navegação à direita

### Intro
- Título do projeto em `text-7xl` (`font-bold`, `tracking-tight`)
- Frase de impacto logo abaixo do título

### Media
- Container com `bg-[#509191]` (ou a cor principal do projeto)
- Mockups de iPhone flutuantes com sombras suaves

### Metadata Grid
- Seção de 3 colunas: **Role**, **Timeline**, **Tools**
- Labels em cinza, valores em negrito

---

## 2. Context Section — The Problem & Solution

- Fundo em cinza ultra-claro: `bg-gray-50`
- Layout de duas colunas:
  - Título da seção à esquerda
  - Parágrafos explicativos à direita
- `leading-relaxed` para legibilidade

---

## 3. Research & Discovery — Storytelling

### Affinity Map Component
- Container que simula post-its coloridos organizados em grupos

### User Persona Card
- Foto circular
- Biografia curta
- Frase de Destaque em itálico e tamanho grande para humanizar o dado

---

## 4. Information Architecture

### User Flow Diagram
- Placeholder para diagrama de User Flow
- Linhas finas e bordas arredondadas nos nodes

### Wireframes Low-Fi
- Exibição em escala de cinza
- Mostra a evolução do pensamento de design

---

## 5. Visual Design System

### Paleta de Cores
- Círculos de cores com códigos hex

### Escala Tipográfica
- Demonstração dos tamanhos e pesos de fonte utilizados

### Component Library
- Grid exibindo botões, inputs e ícones usados no app

---

## 6. High-Fidelity Showcase

- Seções de imagem **Full-Bleed** (largura total) intercaladas com descrições curtas
- `rounded-3xl` em todas as imagens de interface

---

## 7. Conclusão e Próximos Passos

- Texto focado em métricas de sucesso
- Aprendizados pessoais do projeto

---

## Especificações Técnicas

### Animações
- Biblioteca: `framer-motion`
- Padrão de entrada por seção:
  ```js
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  ```

### Espaçamento
- `padding-y` generoso entre grandes blocos: ex. `py-32`
- Garante respiro visual entre seções

### Responsividade
- Grids colapsam para uma única coluna em dispositivos móveis
