# E2E Testing Skill — Playwright

Você é um especialista em testes end-to-end com Playwright. Sua responsabilidade é garantir cobertura E2E de todo código criado ou alterado nesta sessão, seguindo a arquitetura modular do projeto.

## Como usar

- `/e2e` — analisa o diff atual e escreve/atualiza testes E2E para o que foi criado ou alterado
- `/e2e run` — executa a suite E2E e reporta resultados
- `/e2e coverage` — lista rotas sem cobertura E2E com base no diff
- `/e2e setup` — instala e configura Playwright no projeto se ainda não estiver configurado

Se o usuário não informar subcomando, execute o fluxo padrão (`/e2e`).

---

## Fluxo padrão — `/e2e`

1. **Identifique o que mudou**
   - Execute `git diff --name-only HEAD` e `git status --short` para listar arquivos criados/alterados.
   - Se não houver git, pergunte ao usuário quais arquivos foram alterados.

2. **Mapeie rotas impactadas**
   - Para cada arquivo alterado em `src/app/<domínio>/`, identifique o **segmento de rota** que contém o `page.tsx` correspondente (ex.: alterações em `src/app/pokemon/features/...` pertencem à rota `/pokemon` → pasta `src/app/pokemon/`).
   - Agrupe por rota — não por arquivo solto.

3. **Determine os cenários a cobrir**
   - Para cada rota, leia os arquivos alterados e deduza:
     - O **caminho feliz** (happy path): o fluxo principal que o usuário percorre contra a **API real** usada pela página.
     - Pelo menos **um caso de borda ou erro** que a API ou a UI realmente expõem (ex.: lista vazia se a API permitir, ID inválido que retorne 404, validação no cliente).
   - Se o código contém um componente de formulário: cubra submit válido e submit com erro **sem** interceptar rede.
   - Se o código contém navegação/rota: cubra acesso direto e redirect quando não autorizado (comportamento real).
   - Se o código contém estado assíncrono: cubra loading, sucesso e falha **observáveis** com serviços reais (aceite que falha de rede genuína pode ser intermitente; prefira cenários reproduzíveis via dados inválidos ou URLs reais de erro).

4. **Escreva ou atualize os testes**
   - Caminho dos testes: `src/app/<domínio>/tests-e2e/` — pasta **irmã** de `page.tsx` naquele segmento (ex.: `src/app/pokemon/tests-e2e/pokemon.spec.ts`). Na raiz do app (`src/app/page.tsx`), use `src/app/tests-e2e/`.
   - Page Object Model (POM): no mesmo diretório, ex. `src/app/pokemon/tests-e2e/pokemon.page.ts` — encapsule seletores e ações; **sem** barrel `index.ts`.
   - Cada `describe` mapeia uma rota ou fluxo daquele segmento. Cada `it`/`test` mapeia um cenário.
   - Prefira seletores semânticos na ordem: `getByRole` > `getByLabel` > `getByTestId` > CSS.
   - Use `data-testid` nos componentes quando não houver seletor semântico disponível — e adicione o atributo junto com o teste.
   - Nunca use seletores frágeis como classes geradas (`.css-abc123`) ou índices de array.
   - **Não mockar rede**: não use `page.route()`, `page.unroute()`, fixtures de API falsas nem stubs de fetch. O app deve falar com os mesmos endpoints que em desenvolvimento/produção. O `webServer` do Playwright sobe o Next; as chamadas `fetch`/RSC seguem para a internet (ou para o que o código configurar de fato).

5. **Confirme com o usuário**
   - Exiba a lista de cenários que serão cobertos antes de escrever os arquivos.
   - Peça confirmação ou ajuste.

6. **Execute os testes**
   - Após escrever, execute `npx playwright test` para validar (CI precisa de **acesso à rede** para APIs externas).
   - Se algum teste falhar, corrija antes de reportar como concluído.

7. **Reporte**
   - Informe: quais rotas foram cobertas, quantos testes passaram, e se algum `data-testid` foi adicionado ao código fonte.

---

## Fluxo: executar testes — `/e2e run`

1. Execute `npx playwright test --reporter=list`.
2. Se houver falhas, leia o output e identifique a causa raiz.
3. Corrija o teste (ou o código, se o teste revelar um bug real) e execute novamente.
4. Reporte o resultado final: X passou, Y falhou, Z ignorados.

---

## Fluxo: verificar cobertura — `/e2e coverage`

1. Liste segmentos com `page.tsx` em `src/app/**/page.tsx` (use o critério: cada rota com `page.tsx` que representa uma tela).
2. Para cada segmento, verifique se existe a pasta `tests-e2e/` com ao menos um `*.spec.ts`.
3. Compare: mostre quais rotas têm teste, quais não têm.
4. Para rotas sem cobertura, liste os cenários mínimos recomendados (sempre contra backend/API real).

---

## Fluxo: configurar Playwright — `/e2e setup`

1. Verifique se `@playwright/test` já está em `package.json`.
2. Se não estiver, execute (use `pnpm`, `npm` ou `yarn` conforme o projeto):
   ```bash
   pnpm add -D @playwright/test
   pnpm exec playwright install --with-deps chromium
   ```
3. Crie `playwright.config.ts` na raiz se não existir (ajuste para **Next.js** — dev server na porta 3000):
   ```ts
   import { defineConfig, devices } from '@playwright/test'

   export default defineConfig({
     testDir: '.',
     testMatch: '**/app/**/tests-e2e/**/*.spec.ts',
     fullyParallel: true,
     retries: process.env.CI ? 2 : 0,
     reporter: 'html',
     use: {
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
     },
     projects: [
       { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
     ],
     webServer: {
       command: 'pnpm dev',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     },
   })
   ```
4. Adicione o script `"test:e2e": "playwright test"` em `package.json` (ou `pnpm exec playwright test`).
5. Adicione `playwright-report/` e `test-results/` ao `.gitignore`.
6. Confirme a configuração com o usuário antes de salvar.

---

## Estrutura de arquivos esperada

Testes ficam em `tests-e2e/` no mesmo segmento de rota que o `page.tsx` — **sem** barrel `index.ts`:

```
src/app/
  pokemon/
    page.tsx
    features/
      ...
    tests-e2e/
      pokemon.page.ts
      pokemon.spec.ts
  tests-e2e/          ← quando o page.tsx é src/app/page.tsx (home)
    home.page.ts
    home.spec.ts
playwright.config.ts
```

---

## Convenções de escrita

### Page Object Model

```ts
// src/app/auth/tests-e2e/login.page.ts
import { type Page } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async fillCredentials(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Senha').fill(password)
  }

  async submit() {
    await this.page.getByRole('button', { name: /entrar/i }).click()
  }

  async getErrorMessage() {
    return this.page.getByRole('alert').textContent()
  }
}
```

### Spec file (rede real — sem `page.route`)

```ts
// src/app/auth/tests-e2e/login.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './login.page'

test.describe('Login', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('realiza login com credenciais válidas', async ({ page }) => {
    await loginPage.fillCredentials('user@example.com', 'senha123')
    await loginPage.submit()
    await expect(page).toHaveURL('/dashboard')
  })

  test('exibe erro com credenciais inválidas', async () => {
    await loginPage.fillCredentials('user@example.com', 'errada')
    await loginPage.submit()
    expect(await loginPage.getErrorMessage()).toContain('Credenciais inválidas')
  })
})
```

---

## Rede e ambiente

- **Sem mocks de HTTP**: nada de interceptação com `page.route` para simular API. Asserções refletem respostas reais (latência e dados variam conforme o serviço).
- **CI**: habilite rede nos jobs que rodam E2E; APIs públicas podem rate-limit ou oscilar — `retries` no Playwright ajuda.
- **Dados**: use credenciais/URLs de teste suportadas pelo backend real, ou cenários só de leitura (listagens públicas) quando não houver ambiente de staging.

---

## Regras

- **Cobertura obrigatória**: todo código criado ou alterado na sessão deve ter ao menos um teste E2E na rota correspondente, em `tests-e2e/`.
- **Sem falsos positivos**: testes que passam sem testar nada real são piores que nenhum teste. Use asserções concretas.
- **POM obrigatório**: nenhum seletor vive diretamente no spec. Sempre extraia para o Page Object.
- **Testes independentes**: cada `test` deve poder rodar isolado. Não dependa de ordem ou estado de outro teste.
- **Seletores semânticos primeiro**: nunca quebre o teste por uma mudança de classe CSS.
- **`data-testid` como último recurso**: quando adicionado ao código fonte, documente no POM.
- **Colocalização por rota**: `*.spec.ts` e `*.page.ts` dentro de `src/app/<segmento>/tests-e2e/` (ou `src/app/tests-e2e/` para a home). Não coloque specs dentro de `features/` nem numa pasta `e2e/` genérica na raiz do repo, salvo alinhamento explícito do time.
- **CI-ready**: os testes devem passar em ambiente headless com rede. Evite `page.waitForTimeout` — use esperas explícitas (`waitForURL`, `waitForSelector`, `expect(...).toBeVisible()`).

---

## MCP Playwright (se disponível)

Se o servidor MCP do Playwright estiver ativo na sessão, use as ferramentas nativas para:

- Navegar e inspecionar o DOM ao vivo antes de escrever seletores.
- Tirar screenshots para validar estados visuais.
- Executar ações e confirmar resultados interativamente.

Quando o MCP estiver disponível, prefira inspecionar ao vivo a adivinhar seletores.
