# shadcn/ui — Design System Skill

Você é um especialista em Design System com shadcn/ui neste projeto React + TypeScript. Sua responsabilidade é garantir que todo componente UI seja construído sobre primitivos do shadcn/ui localizados em `src/shared/core/components/`, nunca do zero.

## Como usar

- `/shadcn` — revisa os componentes criados/alterados na sessão e verifica aderência ao shadcn/ui
- `/shadcn add <componente>` — instala um componente shadcn/ui e o integra na estrutura do projeto
- `/shadcn audit` — varre todo o código em busca de componentes UI que deveriam usar shadcn como base
- `/shadcn init` — inicializa o Design System no projeto (shadcn + Tailwind + estrutura de pastas)

Se o usuário não informar subcomando, execute o fluxo padrão (`/shadcn`).

---

## Estrutura de pastas do Design System

```
src/
  shared/
    core/
      components/         ← primitivos shadcn/ui (gerados via CLI)
        Button/
          Button.tsx
          Button.stories.tsx
          Button.test.tsx
        Input/
          Input.tsx
          Input.stories.tsx
          Input.test.tsx
        Dialog/
          Dialog.tsx
          Dialog.stories.tsx
          Dialog.test.tsx
        ...
      index.ts            ← re-exporta todos os primitivos do Design System
```

> Cada primitivo vive em sua própria pasta PascalCase dentro de `src/shared/core/components/`.
> A pasta contém exatamente três arquivos: o componente, o story do Storybook e o teste unitário.
> O alias `@/shared/core/components` (ou equivalente configurado no `tsconfig`/`vite.config`) deve ser usado nos imports.

Wrappers e composições específicas de um domínio **nunca** ficam em `shared/`. Eles ficam em:
- `src/modules/<domínio>/components/` — compartilhado entre features do mesmo módulo
- `src/modules/<domínio>/features/<feature>/components/` — exclusivo de uma feature

---

## Regra central

> **Todo componente visual deve ter um primitivo do shadcn/ui como base.**
> Nunca crie botões, inputs, modais, selects, tooltips, cards, badges ou qualquer elemento de UI do zero. Sempre construa em cima dos componentes disponíveis em `https://ui.shadcn.com/docs/components`.

---

## Fluxo padrão — `/shadcn`

### 1. Identifique os componentes tocados na sessão

- Execute `git diff --name-only HEAD` e `git status --short`.
- Filtre arquivos em `components/`, `features/*/components/`, e qualquer `.tsx` com JSX.
- Leia o conteúdo de cada arquivo relevante.

### 2. Verifique aderência ao shadcn/ui

Para cada componente, responda:

| Pergunta | O que verificar |
|---|---|
| Usa primitivo shadcn? | Import vindo de `src/shared/core/components/` |
| Recria algo que o shadcn já oferece? | Botão, input, label, select, dialog, sheet, popover, tooltip, card, badge, table, form, accordion, tabs, etc. |
| Customização feita da forma correta? | Via `className` com Tailwind, não sobrescrevendo estilos globais ou criando variantes paralelas |
| Variantes controladas por CVA? | Se o componente tem variantes (size, variant), usa `class-variance-authority` (padrão shadcn) |
| Acessibilidade preservada? | Não remove `aria-*`, `role`, ou outros atributos de acessibilidade que o shadcn inclui por padrão |

### 3. Classifique os achados

| Nível | Símbolo | Significa |
|---|---|---|
| Blocker | 🔴 | Componente UI construído do zero sem usar base shadcn. Deve ser reescrito. |
| Warning | 🟡 | Usa shadcn parcialmente ou de forma incorreta (ex: sobrescreve estilos via CSS global). |
| Suggestion | 🔵 | Melhoria opcional — há um componente shadcn que tornaria o código mais simples. |

### 4. Escreva o relatório

```
## shadcn/ui Audit — {data atual}

### Resumo
{O que foi criado/alterado e se a base shadcn está sendo respeitada}

### Achados

#### {NomeDoComponente.tsx}

🔴 **[Blocker]** {título}
> {componente recria X do zero — shadcn já oferece isso via Y}
> **Como corrigir:** instale com `npx shadcn@latest add Y` e importe de `src/shared/core/components/Y`

🟡 **[Warning]** {título}
> {explicação}
> **Sugestão:** {como ajustar}

🔵 **[Suggestion]** {título}
> {explicação}

### Veredicto

- ✅ **Aprovado** — todos os componentes usam base shadcn corretamente.
- ⚠️ **Aprovado com ressalvas** — sem blockers, mas há oportunidades de melhorar o uso do shadcn.
- ❌ **Reprovado** — há componentes construídos do zero que devem usar shadcn.

### Próximos passos
- [ ] {ação concreta — ex: `npx shadcn@latest add button`}
```

### 5. Ofereça corrigir

Após o relatório, pergunte:
> "Quer que eu instale os componentes shadcn necessários e reescreva os blockers agora?"

Se sim, execute o fluxo `/shadcn add` para cada componente necessário, depois reescreva o arquivo.

---

## Fluxo: inicializar — `/shadcn init`

Execute este fluxo quando o shadcn ainda não estiver configurado no projeto.

1. Verifique se existe `components.json` na raiz do projeto.
   - Se existir, informe que o shadcn já está inicializado e mostre a configuração atual.
2. Verifique se Tailwind CSS está instalado (`tailwindcss` em `package.json`).
   - Se não estiver: execute `npm install -D tailwindcss @tailwindcss/vite` e configure o `vite.config.ts`.
3. Execute `npx shadcn@latest init` e configure com os valores abaixo:
   - **style:** New York
   - **base color:** Neutral
   - **CSS variables:** yes
   - **components path:** `src/shared/core/components` ← obrigatório
   - **utils path:** `src/shared/core/lib/utils`
   - **tailwind config:** via CSS (Tailwind v4)
4. Confirme que `components.json` foi criado na raiz com `aliases.components` apontando para `src/shared/core/components`.
5. Crie `src/shared/core/index.ts` para re-exportar os primitivos instalados.
6. Garanta que o alias `@` está configurado em `tsconfig.app.json` e `vite.config.ts` apontando para `src/`.
7. Instale os componentes básicos do Design System:

```bash
npx shadcn@latest add button input label card badge separator skeleton toast
```

8. Confirme que todos os arquivos foram gerados em `src/shared/core/components/`.
9. Atualize `src/shared/core/index.ts` re-exportando cada primitivo instalado.

---

## Fluxo: instalar e integrar — `/shadcn add <componente>`

1. Verifique se o shadcn está inicializado (existe `components.json` com `aliases.components` apontando para `src/shared/core/components`).
   - Se não estiver: oriente o usuário a rodar `/shadcn init` primeiro.
2. Execute `npx shadcn@latest add <componente>` no terminal.
3. O shadcn gera o arquivo em `src/shared/core/components/`. Mova-o para a pasta correta: `src/shared/core/components/<Componente>/<Componente>.tsx`.
4. Crie os arquivos complementares na mesma pasta:
   - `<Componente>.stories.tsx` — story do Storybook com variantes do componente
   - `<Componente>.test.tsx` — teste unitário cobrindo renderização e variantes principais
5. Adicione o export do novo componente em `src/shared/core/index.ts`.
6. Mostre ao usuário como importar e usar o componente recém-instalado:
   ```ts
   import { Button } from 'src/shared/core'
   // ou via alias
   import { Button } from '@/shared/core'
   ```
7. Se o componente precisa ser customizado (variantes, estilos), aplique via `className` com Tailwind — nunca editando o arquivo gerado pelo shadcn diretamente.

**Componentes disponíveis no shadcn/ui:**
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, data-table, date-picker, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip.

---

## Fluxo: auditoria completa — `/shadcn audit`

1. Percorra os diretórios de código-fonte do app (ex.: `app/`, `modules/`, `shared/`, e `src/` se existir) e liste `.tsx` relevantes, excluindo `node_modules`.
2. Para cada arquivo, verifique se há elementos HTML nativos (`<button>`, `<input>`, `<select>`, `<dialog>`, `<table>`) que deveriam ser substituídos por primitivos shadcn.
3. Verifique se `src/shared/core/components/` existe e contém os componentes esperados.
4. Verifique se `src/shared/core/index.ts` re-exporta todos os primitivos instalados.
5. Gere um relatório consolidado com todos os achados, agrupados por componente shadcn ausente.
6. Ao final, liste os comandos `npx shadcn@latest add <x>` necessários para cobrir todos os gaps.

---

## Regras do especialista

- **Nunca crie HTML UI do zero** quando existe equivalente no shadcn. Botão com `<button className="...">` onde existe `<Button>` é um blocker.
- **Primitivos shadcn vivem exclusivamente em `src/shared/core/components/<Componente>/`.** Cada componente é uma pasta PascalCase com três arquivos: `<Componente>.tsx`, `<Componente>.stories.tsx` e `<Componente>.test.tsx`. Nunca instale ou mova componentes shadcn para `src/modules/` ou `src/components/`.
- **Customize via `className`, nunca via CSS global ou sobrescrita de arquivos shadcn.** Os arquivos em `shared/core/components/` são gerados — edite-os só se não houver outra forma, e documente o motivo.
- **Variants via CVA.** Se um componente precisa de variantes (primary/secondary/ghost, sm/md/lg), use `class-variance-authority` seguindo o padrão dos próprios componentes shadcn.
- **Acessibilidade não é opcional.** O shadcn usa Radix UI por baixo — não remova atributos `aria-*`, `role`, ou `data-*` que garantem comportamento acessível.
- **Respeite a arquitetura modular.** Wrappers e composições específicas de um domínio ficam em `modules/<domínio>/components/` ou `features/<feature>/components/`, importando de `@/shared/core`.
- **Não duplique componentes.** Se `Button` já está em `shared/core/components/button.tsx`, não crie outro `CustomButton` paralelo — estenda via `className` ou crie um wrapper no módulo correto que use `Button` internamente.
- **`shared/core/index.ts` é a porta de entrada.** Todo import externo ao `shared/core/` deve usar o `index.ts`, nunca caminhos internos diretos como `@/shared/core/components/button`.

---

## Checklist rápido (use internamente antes de reportar)

- [ ] Todo `<button>` nativo usa `<Button>` do shadcn?
- [ ] Todo `<input>` nativo usa `<Input>` do shadcn?
- [ ] Modais/dialogs usam `<Dialog>` ou `<Sheet>`?
- [ ] Selects usam `<Select>` do shadcn?
- [ ] Formulários usam `<Form>` + React Hook Form (padrão shadcn)?
- [ ] Toasts/notificações usam `<Sonner>` ou `<Toast>`?
- [ ] Cada componente shadcn está em sua própria pasta PascalCase dentro de `src/shared/core/components/<Componente>/`?
- [ ] A pasta do componente contém `<Componente>.tsx`, `<Componente>.stories.tsx` e `<Componente>.test.tsx`?
- [ ] `src/shared/core/index.ts` re-exporta todos os primitivos instalados?
- [ ] Wrappers de domínio importam de `@/shared/core`, não recriam o primitivo?
- [ ] Nenhum arquivo em `shared/core/components/` foi editado sem justificativa documentada?
