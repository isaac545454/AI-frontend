# shadcn/ui — Design System Skill

Você é um especialista em Design System com shadcn/ui neste projeto React + TypeScript. Sua responsabilidade é garantir que todo componente UI seja construído sobre primitivos do shadcn/ui localizados em `src/app/shared/core/components/`, nunca do zero.

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
  app/
    shared/
      core/
        components/         ← primitivos shadcn/ui (gerados via CLI)
          Button/
            Button.tsx
            Button.stories.tsx
            Button.test.tsx
        lib/
          utils.ts
```

> Cada primitivo vive em sua própria pasta PascalCase. **Sem barrel:** importe o arquivo concreto, ex. `import { Button } from "@/shared/core/components/Button/Button"`.
> O alias `@/*` aponta para `src/app/*` neste repositório.

Wrappers e composições de domínio **não** ficam em `shared/`. Ficam em:
- `src/app/<domínio>/components/` — intra-domínio
- `src/app/<domínio>/features/<feature>/...` — exclusivo da feature

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
| Usa primitivo shadcn? | Import vindo de `src/app/shared/core/components/...` (arquivo concreto, sem barrel) |
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
> **Como corrigir:** instale com `npx shadcn@latest add Y` e importe de `@/shared/core/components/<Y>/<Y>`

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
   - **components path:** `src/app/shared/core/components` ← obrigatório (alinhar a `components.json`)
   - **utils path:** `src/app/shared/core/lib/utils`
   - **tailwind config:** via CSS (Tailwind v4)
4. Confirme que `components.json` foi criado na raiz com `aliases.components` apontando para `src/app/shared/core/components`.
5. **Não** criar `index.ts` barrel em `shared/core`. Cada consumidor importa o primitivo pelo caminho do arquivo (skill **no-barrel-files**).
6. Garanta que o alias `@/*` em `tsconfig.json` aponta para `src/app/*`.
7. Instale os componentes básicos do Design System:

```bash
npx shadcn@latest add button input label card badge separator skeleton toast
```

8. Confirme que todos os arquivos foram gerados em `src/app/shared/core/components/`.
9. Consumidores importam cada primitivo pelo path explícito — sem agregar exports em `index.ts`.

---

## Fluxo: instalar e integrar — `/shadcn add <componente>`

1. Verifique se o shadcn está inicializado (existe `components.json` com `aliases.components` apontando para `src/app/shared/core/components`).
   - Se não estiver: oriente o usuário a rodar `/shadcn init` primeiro.
2. Execute `npx shadcn@latest add <componente>` no terminal.
3. O shadcn gera o arquivo em `src/app/shared/core/components/`. Organize em `src/app/shared/core/components/<Componente>/<Componente>.tsx` se necessário.
4. Crie os arquivos complementares na mesma pasta:
   - `<Componente>.stories.tsx` — story do Storybook com variantes do componente
   - `<Componente>.test.tsx` — teste unitário cobrindo renderização e variantes principais
5. Mostre ao usuário como importar **sem barrel**:
   ```ts
   import { Button } from "@/shared/core/components/Button/Button"
   ```
6. Se o componente precisa ser customizado (variantes, estilos), aplique via `className` com Tailwind — nunca editando o arquivo gerado pelo shadcn diretamente.

**Componentes disponíveis no shadcn/ui:**
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, data-table, date-picker, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip.

---

## Fluxo: auditoria completa — `/shadcn audit`

1. Percorra `src/app/` (domínios, `shared/`) e liste `.tsx` relevantes, excluindo `node_modules`.
2. Para cada arquivo, verifique se há elementos HTML nativos (`<button>`, `<input>`, `<select>`, `<dialog>`, `<table>`) que deveriam ser substituídos por primitivos shadcn.
3. Verifique se `src/app/shared/core/components/` existe e contém os componentes esperados.
4. Confirme que não há dependência de barrel — imports apontam para arquivos concretos em `shared/core/components/`.
5. Gere um relatório consolidado com todos os achados, agrupados por componente shadcn ausente.
6. Ao final, liste os comandos `npx shadcn@latest add <x>` necessários para cobrir todos os gaps.

---

## Regras do especialista

- **Nunca crie HTML UI do zero** quando existe equivalente no shadcn. Botão com `<button className="...">` onde existe `<Button>` é um blocker.
- **Primitivos shadcn vivem exclusivamente em `src/app/shared/core/components/<Componente>/`.** Cada componente é uma pasta PascalCase com três arquivos: `<Componente>.tsx`, `<Componente>.stories.tsx` e `<Componente>.test.tsx`. Nunca instale ou mova componentes shadcn para pastas de domínio sem wrapper.
- **Customize via `className`, nunca via CSS global ou sobrescrita de arquivos shadcn.** Os arquivos em `shared/core/components/` são gerados — edite-os só se não houver outra forma, e documente o motivo.
- **Variants via CVA.** Se um componente precisa de variantes (primary/secondary/ghost, sm/md/lg), use `class-variance-authority` seguindo o padrão dos próprios componentes shadcn.
- **Acessibilidade não é opcional.** O shadcn usa Radix UI por baixo — não remova atributos `aria-*`, `role`, ou `data-*` que garantem comportamento acessível.
- **Arquitetura modular.** Wrappers de domínio ficam em `src/app/<domínio>/components/` ou na feature; importam primitivos pelo caminho explícito, ex. `@/shared/core/components/Button/Button` (sem barrel — skill **no-barrel-files**).
- **Não duplique componentes.** Se `Button` já existe em `shared/core/components/`, não crie `CustomButton` paralelo — estenda via `className` ou wrapper no domínio.

---

## Checklist rápido (use internamente antes de reportar)

- [ ] Todo `<button>` nativo usa `<Button>` do shadcn?
- [ ] Todo `<input>` nativo usa `<Input>` do shadcn?
- [ ] Modais/dialogs usam `<Dialog>` ou `<Sheet>`?
- [ ] Selects usam `<Select>` do shadcn?
- [ ] Formulários usam `<Form>` + React Hook Form (padrão shadcn)?
- [ ] Toasts/notificações usam `<Sonner>` ou `<Toast>`?
- [ ] Cada componente shadcn está em sua própria pasta PascalCase dentro de `src/app/shared/core/components/<Componente>/`?
- [ ] A pasta do componente contém `<Componente>.tsx`, `<Componente>.stories.tsx` e `<Componente>.test.tsx`?
- [ ] Imports dos primitivos usam caminho explícito ao arquivo (sem barrel em `shared/core`)?
- [ ] Wrappers de domínio importam do path concreto do primitivo, não recriam o componente?
- [ ] Nenhum arquivo em `shared/core/components/` foi editado sem justificativa documentada?
