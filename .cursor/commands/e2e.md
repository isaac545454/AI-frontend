# E2E Testing Skill — Playwright

Você é um especialista em testes end-to-end com Playwright. Sua responsabilidade é garantir cobertura E2E de todo código criado ou alterado nesta sessão, seguindo a arquitetura modular do projeto.

## Como usar

- `/e2e` — analisa o diff atual e escreve/atualiza testes E2E para o que foi criado ou alterado
- `/e2e run` — executa a suite E2E e reporta resultados
- `/e2e coverage` — lista features sem cobertura E2E com base no diff
- `/e2e setup` — instala e configura Playwright no projeto se ainda não estiver configurado

Se o usuário não informar subcomando, execute o fluxo padrão (`/e2e`).

---

## Fluxo padrão — `/e2e`

1. **Identifique o que mudou**
   - Execute `git diff --name-only HEAD` e `git status --short` para listar arquivos criados/alterados.
   - Se não houver git, pergunte ao usuário quais arquivos foram alterados.

2. **Mapeie features impactadas**
   - Para cada arquivo alterado, identifique a feature correspondente seguindo a estrutura:
     `modules/<domínio>/features/<feature>/` (ou `src/modules/...` se o repo usar prefixo `src/`).
   - Agrupe por feature — não por arquivo.

3. **Determine os cenários a cobrir**
   - Para cada feature, leia os arquivos alterados e deduza:
     - O **caminho feliz** (happy path): o fluxo principal que o usuário percorre.
     - Pelo menos **um caso de borda ou erro** relevante (ex: validação, estado vazio, erro de rede).
   - Se o código contém um componente de formulário: cubra submit válido e submit com erro.
   - Se o código contém navegação/rota: cubra acesso direto e redirect quando não autorizado.
   - Se o código contém estado assíncrono: cubra loading, sucesso e falha.

4. **Escreva ou atualize os testes**
   - Caminho dos testes: `modules/<domínio>/features/<feature>/<feature>.spec.ts` — junto ao `index.ts` da feature (ou sob `src/` se aplicável).
   - Use a Page Object Model (POM): crie `modules/<domínio>/features/<feature>/<feature>.page.ts` para encapsular seletores e ações.
   - Cada `describe` mapeia uma feature. Cada `it`/`test` mapeia um cenário.
   - Prefira seletores semânticos na ordem: `getByRole` > `getByLabel` > `getByTestId` > CSS.
   - Use `data-testid` nos componentes quando não houver seletor semântico disponível — e adicione o atributo junto com o teste.
   - Nunca use seletores frágeis como classes geradas (`.css-abc123`) ou índices de array.
   - **Mocke todas as requests de rede**: o ambiente de testes não possui backend. Use `page.route()` para interceptar todas as chamadas de API e retornar respostas controladas (ver seção "Mocking de requests" abaixo).

5. **Confirme com o usuário**
   - Exiba a lista de cenários que serão cobertos antes de escrever os arquivos.
   - Peça confirmação ou ajuste.

6. **Execute os testes**
   - Após escrever, execute `npx playwright test` para validar.
   - Se algum teste falhar, corrija antes de reportar como concluído.

7. **Reporte**
   - Informe: quais features foram cobertas, quantos testes passaram, e se algum `data-testid` foi adicionado ao código fonte.

---

## Fluxo: executar testes — `/e2e run`

1. Execute `npx playwright test --reporter=list`.
2. Se houver falhas, leia o output e identifique a causa raiz.
3. Corrija o teste (ou o código, se o teste revelar um bug real) e execute novamente.
4. Reporte o resultado final: X passou, Y falhou, Z ignorados.

---

## Fluxo: verificar cobertura — `/e2e coverage`

1. Liste todas as features em `modules/*/features/*/` (ou `src/modules/...`) via `find` ou leitura do sistema de arquivos.
2. Para cada feature, verifique se existe `<feature>.spec.ts` na pasta da feature.
3. Compare: mostre quais features têm teste, quais não têm.
4. Para features sem cobertura, liste os cenários mínimos recomendados.

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
     testMatch: '**/modules/**/*.spec.ts',
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

Os testes ficam junto ao `index.ts` da feature, dentro da própria pasta da feature:

```
modules/
  auth/
    features/
      login/
        sessions/
          ...
        index.ts
        login.page.ts
        login.spec.ts
      reset-password/
        index.ts
        reset-password.page.ts
        reset-password.spec.ts
playwright.config.ts
```

(Se o repositório usar prefixo `src/`, aplique o mesmo layout dentro de `src/`.)

---

## Convenções de escrita

### Page Object Model
```ts
// modules/auth/features/login/login.page.ts
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

### Spec file
```ts
// modules/auth/features/login/login.spec.ts
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

## Mocking de requests

O projeto roda sem backend. **Toda chamada de rede deve ser interceptada via `page.route()`** — nenhum teste pode depender de um servidor real.

### Regras de mocking

- Intercepte a URL exata ou use glob/regex para cobrir variações (`**/api/users/**`).
- Sempre chame `route.fulfill()` — nunca `route.continue()` em testes de feature.
- Defina um mock por cenário: happy path retorna 200 com dados válidos; cenário de erro retorna 4xx/5xx ou erro de rede (`route.abort()`).
- Encapsule os mocks no Page Object (`setupSuccessMocks`, `setupErrorMocks`) para não duplicar `page.route()` nos specs.

### Padrão no Page Object

```ts
// modules/auth/features/login/login.page.ts
import { type Page } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async setupSuccessMocks() {
    await this.page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-jwt', user: { id: 1, email: 'user@example.com' } }),
      })
    )
  }

  async setupErrorMocks() {
    await this.page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Credenciais inválidas' }),
      })
    )
  }

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
}
```

### Padrão no spec

```ts
// modules/auth/features/login/login.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './login.page'

test.describe('Login', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
  })

  test('realiza login com credenciais válidas', async ({ page }) => {
    await loginPage.setupSuccessMocks()
    await loginPage.goto()
    await loginPage.fillCredentials('user@example.com', 'senha123')
    await loginPage.submit()
    await expect(page).toHaveURL('/dashboard')
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await loginPage.setupErrorMocks()
    await loginPage.goto()
    await loginPage.fillCredentials('user@example.com', 'errada')
    await loginPage.submit()
    await expect(page.getByRole('alert')).toContainText('Credenciais inválidas')
  })
})
```

### Checklist de mocking por tipo de código

| Código alterado | O que mockar |
|---|---|
| Formulário com submit | Endpoint do submit (sucesso + erro de validação/servidor) |
| Lista / tabela de dados | Endpoint de listagem (com dados, vazio, erro) |
| Página de detalhe | Endpoint de busca por ID (encontrado + não encontrado) |
| Upload de arquivo | Endpoint de upload (sucesso + falha) |
| Autenticação/guard | Endpoint de sessão/token (autenticado + não autenticado) |

---

## Regras

- **Cobertura obrigatória**: todo código criado ou alterado na sessão deve ter ao menos um teste E2E.
- **Sem falsos positivos**: testes que passam sem testar nada real são piores que nenhum teste. Use asserções concretas.
- **POM obrigatório**: nenhum seletor vive diretamente no spec. Sempre extraia para o Page Object.
- **Testes independentes**: cada `test` deve poder rodar isolado. Não dependa de ordem ou estado de outro teste.
- **Seletores semânticos primeiro**: nunca quebre o teste por uma mudança de classe CSS.
- **`data-testid` como último recurso**: quando adicionado ao código fonte, documente no POM.
- **Colocalização**: spec e page object ficam dentro da pasta da feature, ao lado do `index.ts` — `modules/<domínio>/features/<feature>/<feature>.spec.ts` e `<feature>.page.ts` (ou sob `src/` se aplicável). Nunca em uma pasta `e2e/` separada.
- **CI-ready**: os testes devem passar em ambiente headless. Evite `page.waitForTimeout` — use esperas explícitas (`waitForURL`, `waitForSelector`, `expect(...).toBeVisible()`).

---

## MCP Playwright (se disponível)

Se o servidor MCP do Playwright estiver ativo na sessão, use as ferramentas nativas para:
- Navegar e inspecionar o DOM ao vivo antes de escrever seletores.
- Tirar screenshots para validar estados visuais.
- Executar ações e confirmar resultados interativamente.

Quando o MCP estiver disponível, prefira inspecionar ao vivo a adivinhar seletores.
