# Especificação: Multizone + pacotes instaláveis + módulos tipo plugin

## 1. Objetivo

Migrar a arquitetura atual (uma única app Next.js com módulos em `src/app/{jsonplaceholder,pokemon,rick-and-morty}` e código compartilhado em `src/app/shared`) para:

1. **Multizone (Next.js)** — várias aplicações Next.js servindo prefixos distintos sob o mesmo domínio (app **home** + apps secundárias).
2. **Pacotes instaláveis** — extrair `shared` para bibliotecas versionadas no ecossistema npm/workspace (consumo via `package.json`, não apenas paths locais).
3. **Extensão tipo plugin** — módulos de negócio instaláveis e registráveis com contrato explícito (descoberta, rotas, dependências), sem acoplamento direto ao código-fonte da app home.

Este documento define **visão alvo**, **contratos**, **fases de migração** e **critérios de aceite**. Não substitui RFCs de implementação fina (CI, domínios, secrets).

---

## 2. Estado atual (baseline)

| Aspecto | Situação |
|--------|----------|
| App | Uma app Next (`next-modular-arch`), React 19 / Next 16 |
| Alias TS | `@/*` → `./src/app/*` |
| Módulos | Rotas e features sob `src/app/<modulo>/…` |
| Compartilhado | `src/app/shared/{components,lib}` importado como `@/shared/…` |
| Padrão UI | Presentation/container em `sessions/` + serviços HTTP com `httpClient` |

**Implicação:** tudo compila e faz deploy como um único artefato; não há fronteira de pacote nem de processo entre a app **home** e os módulos na app única (baseline).

---

## 3. Visão alvo (arquitetura)

### 3.1 Multizone (Next.js)

- **Home (primary)** — aplicação Next responsável pelo shell global: `layout` raiz, design tokens/`globals.css`, `AppProviders`, navegação entre prefixos, página inicial (ex.: `apps/home`).
- **Apps secundárias** — uma app Next por domínio vertical (ex.: `apps/jsonplaceholder`, `apps/pokemon`, `apps/rick-and-morty`), cada uma com:
  - `basePath` alinhado ao prefixo público (ex. `/jsonplaceholder`, `/pokemon`, `/rick-and-morty`);
  - `assetPrefix` coerente em produção para evitar colisão de `/_next/static`;
  - próprio `next.config` (imagens remotas específicas do módulo podem ficar nessa app).

**Roteamento em produção:** reverse proxy (nginx, CDN, load balancer) encaminha por prefixo de path para o serviço correto; a home pode expor links estáveis para as apps secundárias sem importar código delas.

**Desenvolvimento local:** opções aceitáveis (escolher uma na implementação):

- Vários `next dev` em portas diferentes + proxy local unificado; ou
- Home com `rewrites`/`middleware` apontando para origens das apps secundárias (quando suportado pela stack).

### 3.2 Pacotes instaláveis (substituindo `shared`)

Extrair para **pacotes dentro de um monorepo** (recomendado: pnpm workspaces ou npm workspaces), publicáveis no npm privado ou instalados via `workspace:*`.

**Proposta inicial de pacotes (sem barrel files; imports sempre até o arquivo `.ts`/`.tsx`):**

| Pacote | Responsabilidade | Notas |
|--------|------------------|--------|
| `@next-modular-arch/ui-data` | Componentes de lista/dados: `Card`, `Pagination`, `CardSkeleton`, `CardGridSkeleton`, `QueryErrorFallback`, `ModuleBackNav` | `peerDependencies`: `react`, `react-dom`, `@tanstack/react-query` conforme uso |
| `@next-modular-arch/ui-errors` | `ErrorBoundary` e tipos relacionados | Mesmo padrão de peers |
| `@next-modular-arch/http` | `httpClient` (axios) | Dependência direta de `axios`; sem React |
| `@next-modular-arch/query` | `createQueryClient` na raiz; hooks e primitives do TanStack expostos por **subpaths explícitos** (ex.: `@next-modular-arch/query/useQuery`, `…/useMutation`, `…/QueryClientProvider`) — cada subpath um ficheiro, sem `index.ts` barrel | Peers: `react`, `react-dom`, `@tanstack/react-query` |

**Não importar `@tanstack/react-query` nos apps/feature packages** quando existir subpath equivalente em `@next-modular-arch/query`; manter `@tanstack/react-query` nas `dependencies` dos consumidores para satisfazer peers e tipo-alinhamento. `@tanstack/react-query-devtools` continua só onde for necessário.

Novos símbolos oficialmente suportados: acrescentar ficheiro + entrada em `"exports"` do pacote `query`.

Pacotes **não** devem importar rotas nem código de módulos de negócio; apenas utilitários e UI genérica.

**Versionamento:** semver independente por pacote; breaking changes em UI/http documentados no CHANGELOG de cada pacote.

### 3.3 Módulos como plugins

Um **módulo plugin** é um pacote (ou meta-pacote) que:

1. **Declara um manifesto** (JSON ou módulo TS compilado) com, no mínimo:
   - `id` (slug estável);
   - `basePath` público;
   - `displayName` / metadados para o hub de navegação;
   - opcional: `requiredPeers` (versões de `@tanstack/react-query`, etc.).

2. **Exporta superfície de integração** para a home:
   - Com várias apps Next (multi-zones): o “plugin” é a **própria app secundária** (deploy separado); a home só precisa do manifest para links e feature flags.
   - Para evolução futura: pacote `@next-modular-arch/module-<nome>` exportando **rotas React** ou **segmentos** consumidos por um loader dinâmico na home (somente se a estratégia for single-build; ver §6).

3. **Não depende** da home em tempo de build da app secundária além de pacotes compartilhados acima.

**Registry na home:** arquivo ou API que agrega manifests dos plugins instalados para montar a home (`page.tsx`) e menus — substituindo listas hardcoded de cards por dados derivados do registry.

---

## 4. Contratos e invariantes

### 4.1 Entre home e apps secundárias

- Prefixos de URL são **únicos** e estáveis.
- CSS/design system: ou tokens compartilhados via pacote `@next-modular-arch/theme` (opcional), ou convenção documentada para não duplicar variáveis com nomes divergentes.
- Cookies/auth (se existirem no futuro): domínio e path base documentados para leitura nas apps secundárias.

### 4.2 Entre pacotes `shared` e consumidores

- APIs públicas apenas em arquivos explícitos (sem reexports centralizados em `index.ts`).
- Peers alinhados entre home e todas as apps secundárias que renderizam os mesmos componentes.

### 4.3 Testes

- E2E (Playwright): base URL pode passar a ser multi-origin ou multi-port em dev; especificar `PLAYWRIGHT_*` ou fixture que resolve URLs por app/prefixo.
- Testes unitários (futuros) ficam nos pacotes onde a lógica mora.

---

## 5. Fases de migração sugeridas

### Fase A — Monorepo + pacotes (sem multizone)

1. Criar `packages/ui-data`, `packages/ui-errors`, `packages/http`, `packages/query` (nomes finais a definir).
2. Mover código de `src/app/shared/…` para os pacotes; ajustar imports na app para `@next-modular-arch/…`.
3. Manter uma única app Next até estabilizar CI e exports.

**Aceite:** build e `test:e2e` verdes; zero imports residuais para `@/shared/…`.

### Fase B — Registry de módulos + manifestos

1. Introduzir `packages/module-registry` ou `src/registry/plugins.manifest.ts` gerado a partir dos manifests dos módulos.
2. Refatorar `src/app/page.tsx` para ler o registry (nome, path, descrição).

**Aceite:** adicionar um módulo novo exige apenas novo pacote/manifest + app em `apps/<nome>` (ou rota), sem editar manualmente N lugares na home.

### Fase C — Multi-zones (várias apps Next)

1. Extrair cada vertical para `apps/home`, `apps/jsonplaceholder`, etc.
2. Configurar `basePath` / `assetPrefix` e proxy de produção.
3. Migrar layouts específicos para dentro da app correspondente; shell global só na home.

**Aceite:** deploy independente por app/prefixo; navegação entre prefixos funciona em staging.

### Fase D — Publicação / consumo externo (opcional)

1. Publicar pacotes no registry npm privado.
2. Documentar como terceiros criam um “plugin” (manifest + app em `apps/*` + dependência dos pacotes `@next-modular-arch/*`).

---

## 6. Decisões em aberto (precisam de RFC curta)

1. **Multizone vs monorepo single-deploy:** multizone maximiza isolamento de deploy; um único build com imports dinâmicos maximiza simplicidade operacional. Esta spec assume multizone como alvo declarado pelo produto.
2. **Estilo/CSS:** Tailwind em cada app vs pacote de preset compartilhado.
3. **Ferramenta de monorepo:** Turborepo vs npm scripts apenas; impacto em cache de CI.
4. **Autenticação e dados sensíveis:** se surgirem, definir boundary BFF por app/prefixo ou gateway único.

---

## 7. Não objetivos (por ora)

- Substituir Next por outro framework.
- Introduzir barrel files (`index.ts` só para reexport).
- Micro-frontends arbitrários via iframe ou Module Federation (podem ser reconsiderados em spec futura).

---

## 8. Referências conceituais

- [Next.js Multi-Zones](https://nextjs.org/docs/app/building-your-application/deploying/multi-zones) — composição de apps por prefixo.
- Padrões internos do repositório: presentation/container em `sessions/`, imports diretos aos arquivos fonte.

---

## 9. Resumo executivo

**Migrar** significa: (1) fatiar deploy por app Next com paths estáveis (multi-zones); (2) tornar `shared` bibliotecas versionadas consumidas como dependências; (3) tratar cada módulo de negócio como plugin com manifest e, na prática, como app deployável independente, usando os pacotes compartilhados como único acoplamento técnico permitido.
