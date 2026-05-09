# App de E-commerce — Task Completa

## Visão Geral

Construir um app de e-commerce simples com listagem de produtos paginada, busca client-side e carrinho de compras persistido. A implementação segue arquitetura modular com Feature Sliced Design e split hook/presentation (ver regras em `.claude/rules/`).

### Stack

| Item | Versão | Nota |
|---|---|---|
| React | 19+ | com React Compiler |
| TypeScript | 5+ | strict mode |
| TanStack Router | 1.x | file-based routing |
| Zustand | 5.x | persist middleware |
| TailwindCSS | 4.x | utility-first |
| Axios | 1.x | instância `http` centralizada |
| TanStack Query | 5.x | configurado, usado quando houver chamadas reais |
| Playwright | latest | E2E |

### Aliases de path (tsconfig + vite)

```
@/*        → src/*
modules/*  → src/modules/*
shared/*   → src/shared/*
```

### Dependência entre etapas

```
Etapa 1 → Etapa 2 → Etapas 3 e 4 (paralelo) → Etapa 5 → Etapas 6 e 8
```

---

## Estrutura final esperada

```
src/
  app/
    routes/
      __root.tsx          # layout root com Header + Outlet
      index.tsx           # rota / → ProductListPage
      cart.tsx            # rota /cart → CartViewPage
    routeTree.gen.ts      # gerado automaticamente pelo TanStack Router
  modules/
    catalog/
      types/
        catalog.types.ts
      features/
        product-list/
          sessions/
            ProductListSession/
              ProductListSessionLayout.tsx
              ProductListSession.tsx
              useProductListSession.ts
            ProductGrid/
              ProductGrid.tsx
              useProductGrid.ts
          services/
            productService.ts
          index.tsx
      index.ts
    cart/
      types/
        cart.types.ts
      store/
        cart.store.ts
      features/
        cart-view/
          sessions/
            CartSession/
              CartSessionLayout.tsx
              CartSession.tsx
              useCartSession.ts
            CartItemList/
              CartItemList.tsx
              useCartItemList.ts
          index.tsx
      index.ts
  shared/
    core/
      components/
        Header/
          Header.tsx
          useHeader.ts
    lib/
      http.ts
      query-client.ts
    utils/
      format.ts
  main.tsx
  index.css
```

---

## Etapa 1 — Domínio e estrutura base

### Objetivo

Criar os módulos `catalog` e `cart` com types, services mockados e store do carrinho. É a fundação que todas as demais etapas importam.

### Arquivos e conteúdo esperado

#### `modules/catalog/types/catalog.types.ts`
```ts
export interface Product {
  id: string
  name: string
  description: string
  price: number       // em reais, ex: 19999.99
  imageUrl: string    // URL de imagem pública (Unsplash ok)
}
```

#### `modules/catalog/features/product-list/services/productService.ts`
- Array local `PRODUCTS` com exatamente **20 produtos** (eletrônicos, cada um com todos os campos)
- Função `getProducts(): Product[]` que retorna o array

#### `modules/catalog/index.ts`
```ts
export type { Product } from './types/catalog.types'
export { ProductListPage } from './features/product-list/index'
```

#### `modules/cart/types/cart.types.ts`
```ts
import type { Product } from 'modules/catalog'

export interface CartItem {
  product: Product
  quantity: number
}
```

#### `modules/cart/store/cart.store.ts`
- Store Zustand com `persist` middleware (chave `'cart-storage'`)
- Estado: `items: CartItem[]`
- Actions: `addItem(product)`, `removeItem(productId)`, `clearCart()`
- `addItem`: se produto já existe, incrementa quantidade; senão, adiciona com `quantity: 1`
- `removeItem`: remove o item inteiro (não decrementa)
- Seletores exportados:
  - `selectTotalItems(state)` — soma de todas as quantidades
  - `selectItemQuantity(productId)` — retorna função seletor que devolve quantidade daquele produto

#### `modules/cart/index.ts`
```ts
export { useCartStore, selectTotalItems, selectItemQuantity } from './store/cart.store'
export type { CartItem } from './types/cart.types'
export { CartViewPage } from './features/cart-view/index'
```

### Critérios de aceite

- [ ] `modules/catalog` e `modules/cart` com estrutura correta (sem pastas vazias)
- [ ] 20 produtos com todos os campos preenchidos
- [ ] `addItem` incrementa quantidade se produto já existe
- [ ] `removeItem` remove o item inteiro (não decrementa para zero)
- [ ] `persist` ativo — estado sobrevive a reload da página
- [ ] `selectTotalItems` retorna soma das quantidades (não número de produtos distintos)
- [ ] `selectItemQuantity(id)` retorna `0` para produto não adicionado
- [ ] `index.ts` de cada módulo não expõe paths internos

---

## Etapa 2 — Header compartilhado com contador do carrinho

### Objetivo

Header fixo no topo, presente em todas as páginas, com logo clicável, botão de carrinho e badge reativo com total de itens.

### Por que em `shared/core/components/`?

O Header não tem lógica de negócio própria, mas acessa o store do carrinho como consumidor externo — igual a qualquer outro componente que precise do contador. Por ser usado em mais de um módulo, vive em `shared/core/components/`.

### Arquivos e conteúdo esperado

#### `shared/core/components/Header/useHeader.ts`
```ts
// lê selectTotalItems do store e expõe handleCartClick via useNavigate
export function useHeader() {
  const cartItemCount = useCartStore(selectTotalItems)
  // navega para /cart ao clicar
  return { cartItemCount, onCartClick }
}
```

#### `shared/core/components/Header/Header.tsx`
```tsx
// chama useHeader() no topo, renderiza JSX
// data-testid necessários:
//   header-logo         → link para /
//   header-cart-button  → botão que dispara onCartClick
//   header-cart-badge   → span com o número; opacity-0 quando 0, opacity-100 quando > 0
```

Estrutura visual:
- `sticky top-0 z-50` com `border-b` e shadow
- Logo "Shop" à esquerda (link para `/`)
- Botão de carrinho à direita com ícone `ShoppingCart` (lucide-react), texto "Carrinho" e badge absoluto

### `data-testid` obrigatórios

| testid | Elemento |
|---|---|
| `header-logo` | Link do logo |
| `header-cart-button` | Botão do carrinho |
| `header-cart-badge` | Badge numérico |

### Critérios de aceite

- [ ] Badge exibe `0` (ou `opacity-0`) quando carrinho vazio
- [ ] Badge exibe contagem correta ao adicionar produtos
- [ ] Badge atualiza sem reload — reativo ao store
- [ ] Clique no botão do carrinho navega para `/cart`
- [ ] Clique no logo navega para `/`
- [ ] `Header.tsx` importa store apenas via `modules/cart` (public API)
- [ ] Lógica no hook, JSX na presentation — sem `useState`/`useEffect` no `Header.tsx`

### Testes E2E

- [ ] Carrinho vazio → badge com `opacity-0` (ou oculto)
- [ ] Adicionar 3 produtos → badge exibe `3`
- [ ] Clique em `header-cart-button` → URL muda para `/cart`
- [ ] Clique em `header-logo` na página do carrinho → URL muda para `/`

---

## Etapa 3 — Página de listagem de produtos

### Objetivo

Tela principal: grid com 10 produtos por página, paginação client-side, botão "Adicionar ao carrinho" reativo ao estado do carrinho.

### Arquivos e conteúdo esperado

#### `modules/catalog/features/product-list/sessions/ProductListSession/useProductListSession.ts`
- Chama `getProducts()` e controla paginação
- Estado: `currentPage`, `query` (para busca — ver Etapa 6)
- Lógica: `totalPages`, `paginatedProducts` (slice de 10), handlers `onNext`, `onPrev`, `onQueryChange`
- `onQueryChange` reseta `currentPage` para `1`

#### `modules/catalog/features/product-list/sessions/ProductListSession/ProductListSession.tsx`
- Chama `useProductListSession()` no topo
- Passa todos os valores para `<ProductGrid />`
- Sem lógica própria

#### `modules/catalog/features/product-list/sessions/ProductListSession/ProductListSessionLayout.tsx`
- Layout puro: `<main>` com `bg-gray-50`, `max-w-7xl`, `px-4 py-8`
- Aceita `children: React.ReactNode`
- Sem hook

#### `modules/catalog/features/product-list/sessions/ProductGrid/useProductGrid.ts`
- Lê `addItem` e `items` do store via `useCartStore`
- Expõe `onAddToCart(product)` e `getQuantity(productId): number`

#### `modules/catalog/features/product-list/sessions/ProductGrid/ProductGrid.tsx`
- Props: `products`, `currentPage`, `totalPages`, `query`, `onNext`, `onPrev`, `onQueryChange`
- Chama `useProductGrid()` no topo
- Renderiza: título "Produtos", campo de busca, grid de cards, paginação
- Card por produto: imagem `h-48 object-cover`, nome, descrição `line-clamp-2`, preço em BRL, botão add
- Botão: **índigo** com "Adicionar ao carrinho" quando `qty === 0`; **verde** com "No carrinho: N" quando `qty > 0`

#### `modules/catalog/features/product-list/index.tsx`
```tsx
export function ProductListPage() {
  return (
    <ProductListSessionLayout>
      <ProductListSession />
    </ProductListSessionLayout>
  )
}
```

### `data-testid` obrigatórios

| testid | Elemento |
|---|---|
| `product-grid` | Container do grid |
| `product-card` | Cada card (20 no total, 10 por página) |
| `add-to-cart-button` | Botão dentro de cada card |
| `pagination-prev` | Botão "Anterior" |
| `pagination-next` | Botão "Próximo" |
| `pagination-info` | Texto "Página X de Y" |
| `search-input` | Campo de busca |
| `empty-search-message` | Mensagem quando nenhum resultado |

### Critérios de aceite

- [ ] Exibir exatamente 10 produtos na primeira carga
- [ ] `pagination-prev` desabilitado na página 1
- [ ] `pagination-next` desabilitado na última página
- [ ] Texto de paginação: `Página 1 de 2` (ou equivalente)
- [ ] Clicar "Próximo" → segunda página com os 10 produtos restantes
- [ ] Clicar "Anterior" na página 2 → volta para página 1
- [ ] Adicionar produto → badge do header incrementa imediatamente
- [ ] Mesmo produto adicionado 2×→ botão mostra "No carrinho: 2" (verde)
- [ ] `ProductGrid.tsx` sem `useState`, `useEffect` — toda lógica no hook
- [ ] Sem imports de outros features (ex: cart-view)

### Testes E2E

- [ ] Página 1 → 10 `product-card` visíveis
- [ ] Clicar `pagination-next` → `pagination-info` exibe "Página 2 de 2"
- [ ] Na página 2 → `pagination-next` está `disabled`
- [ ] Clicar `pagination-prev` → volta para "Página 1 de 2"
- [ ] Na página 1 → `pagination-prev` está `disabled`
- [ ] Clicar `add-to-cart-button` do 1º produto → `header-cart-badge` exibe `1`
- [ ] Clicar 2× no mesmo produto → botão exibe "No carrinho: 2"

---

## Etapa 4 — Página do carrinho

### Objetivo

Exibir itens adicionados com quantidades, subtotais, total geral e controle `− qty +` por item.

### Arquivos e conteúdo esperado

#### `modules/cart/features/cart-view/sessions/CartSession/useCartSession.ts`
```ts
export function useCartSession() {
  const items = useCartStore((state) => state.items)
  return { items }
}
```

#### `modules/cart/features/cart-view/sessions/CartSession/CartSession.tsx`
- Chama `useCartSession()`, passa `items` para `<CartItemList />`

#### `modules/cart/features/cart-view/sessions/CartSession/CartSessionLayout.tsx`
- Layout **full-width**: sem `max-w-*`, sem `mx-auto`, sem padding lateral
- `<main className="min-h-screen bg-gray-50"><div className="w-full py-8">{children}</div></main>`

#### `modules/cart/features/cart-view/sessions/CartItemList/useCartItemList.ts`
- Props: `{ items: CartItem[] }`
- Lê `removeItem` e `addItem` do store
- Calcula `total = Σ (product.price × quantity)`
- Expõe: `total`, `onRemove(productId)`, `onAdd(product)`

#### `modules/cart/features/cart-view/sessions/CartItemList/CartItemList.tsx`
- Props: `{ items: CartItem[] }`
- Chama `useCartItemList({ items })` no topo
- **Empty state** (`items.length === 0`): mensagem centralizada
- **Lista**: cada item com imagem `h-20 w-20`, nome, preço unitário, subtotal, controle `− qty +`
- Controle: `−` chama `onRemove` (remove item inteiro), número é a quantidade, `+` chama `onAdd`
- Footer com total geral em destaque

#### `modules/cart/features/cart-view/index.tsx`
```tsx
export function CartViewPage() {
  return (
    <CartSessionLayout>
      <CartSession />
    </CartSessionLayout>
  )
}
```

### `data-testid` obrigatórios

| testid | Elemento |
|---|---|
| `cart-empty` | Container do estado vazio |
| `cart-item-list` | `<ul>` com os itens |
| `cart-item` | Cada `<li>` (um por produto) |
| `cart-item-name` | Nome do produto no item |
| `cart-item-quantity` | Número de quantidade |
| `cart-item-subtotal` | Subtotal do item (preço × qty) |
| `cart-item-remove` | Botão `−` |
| `cart-item-add` | Botão `+` |
| `cart-total` | Total geral |

### Critérios de aceite

- [ ] Carrinho vazio → `cart-empty` visível, `cart-item-list` ausente
- [ ] 2 produtos distintos → 2 `cart-item` com nomes, preços e subtotais corretos
- [ ] Subtotal = `product.price × quantity` formatado em BRL
- [ ] Total geral = soma de todos os subtotais
- [ ] Clicar `−` → item removido da lista, total recalculado, badge do header decrementado
- [ ] Clicar `+` → quantidade incrementa, subtotal e total atualizados
- [ ] Todos os itens removidos → `cart-empty` exibido
- [ ] Layout sem margens laterais — conteúdo ocupa 100% da largura
- [ ] `CartItemList.tsx` sem `useState`, `useEffect` — toda lógica no hook

### Testes E2E

- [ ] `/cart` sem itens → `cart-empty` visível
- [ ] Adicionar produto na home, ir para `/cart` → produto listado com qty `1`
- [ ] Mesmo produto adicionado 3× → `cart-item-quantity` exibe `3`, `cart-item-subtotal` = preço × 3
- [ ] Clicar `cart-item-remove` → item some, `cart-total` recalculado
- [ ] Remover todos → `cart-empty` visível
- [ ] Clicar `cart-item-add` → `cart-item-quantity` incrementa

---

## Etapa 5 — Roteamento e composição do app shell

### Objetivo

Conectar módulos no app shell com TanStack Router (file-based), Header em todas as páginas e 404 tratado.

### Arquivos e conteúdo esperado

#### `app/routes/__root.tsx`
```tsx
export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <main className="flex flex-col items-center justify-center py-24 gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Página não encontrada</p>
    </main>
  ),
})
```

#### `app/routes/index.tsx`
```tsx
export const Route = createFileRoute('/')({ component: ProductListPage })
```

#### `app/routes/cart.tsx`
```tsx
export const Route = createFileRoute('/cart')({ component: CartViewPage })
```

#### `main.tsx`
- Cria o router com `routeTree` gerado, renderiza `<RouterProvider />`
- Sem providers adicionais (Zustand não precisa de Provider)

### Critérios de aceite

- [ ] `/` → `ProductListPage` renderizada com `Header`
- [ ] `/cart` → `CartViewPage` renderizada com `Header`
- [ ] Navegação entre páginas sem reload — SPA
- [ ] Estado do carrinho preservado ao navegar
- [ ] Rota inexistente → componente 404
- [ ] `app/` importa módulos apenas pela public API (`modules/catalog`, `modules/cart`)

### Testes E2E

- [ ] Acessar `/` → `product-grid` visível com `Header`
- [ ] Acessar `/cart` → `cart-empty` ou `cart-item-list` visível com `Header`
- [ ] Clicar `header-cart-button` na home → URL `/cart`
- [ ] Clicar `header-logo` no carrinho → URL `/`
- [ ] Acessar `/inexistente` → texto "404" visível

---

## Etapa 6 — Busca de produtos na home

### Objetivo

Filtro client-side por nome ou descrição que recalcula paginação sem recarregar dados.

### Mudanças nos arquivos existentes

#### `useProductListSession.ts`
- Adicionar `query: string` e `setQuery`
- `filteredProducts`: filtra pelo `query` (case-insensitive) em `name` e `description`
- `totalPages` e `paginatedProducts` calculados sobre `filteredProducts`
- `onQueryChange(value)` → `setQuery(value)` + `setCurrentPage(1)`

#### `ProductGrid.tsx`
- Renderizar `<input>` de busca acima do grid (testid: `search-input`)
- Se `products.length === 0`: exibir `<p data-testid="empty-search-message">Nenhum produto encontrado</p>`

### Critérios de aceite

- [ ] Campo de busca visível acima do grid na home
- [ ] Digitar → grid filtra em tempo real (sem debounce obrigatório)
- [ ] Busca sem resultado → `empty-search-message` visível, grid ausente
- [ ] Limpar campo → todos os 20 produtos voltam (página 1)
- [ ] `totalPages` recalculado sobre o resultado filtrado
- [ ] Busca com 5 resultados → apenas 1 página, `pagination-next` desabilitado
- [ ] Busca reseta `currentPage` para `1` ao digitar
- [ ] `ProductGrid.tsx` continua sem lógica — filtro apenas no hook

### Testes E2E

- [ ] `search-input` visível na home
- [ ] Digitar "MacBook" → apenas cards com "MacBook" no nome/descrição visíveis
- [ ] Digitar "xyznotexist" → `empty-search-message` visível
- [ ] Limpar campo → `product-grid` com 10 cards (página 1)
- [ ] Busca com resultado em 1 página → `pagination-next` `disabled`
- [ ] Ir para página 2, digitar algo → volta para página 1

---

## Etapa 8 — Melhorias de UX

### Objetivo

Refinamentos pós-entrega: botão reativo por produto na listagem e controle de quantidade no carrinho.

### Mudanças nos arquivos existentes

#### `modules/cart/store/cart.store.ts`
- Adicionar e exportar seletor `selectItemQuantity(productId: string)` → `(state) => number`

#### `modules/cart/index.ts`
- Exportar `selectItemQuantity`

#### `modules/catalog/features/product-list/sessions/ProductGrid/useProductGrid.ts`
- Ler `items` do store e expor `getQuantity(productId): number`

#### `modules/catalog/features/product-list/sessions/ProductGrid/ProductGrid.tsx`
- Para cada card:
  - `qty = getQuantity(product.id)`
  - `qty > 0` → botão **verde** (`bg-green-600`), texto `"No carrinho: {qty}"`
  - `qty === 0` → botão **índigo** (`bg-indigo-600`), texto `"Adicionar ao carrinho"`

#### `modules/cart/features/cart-view/sessions/CartSession/CartSessionLayout.tsx`
- Remover `max-w-*` e `mx-auto` — layout full-width
- Manter apenas `min-h-screen bg-gray-50` + `w-full py-8`

#### `modules/cart/features/cart-view/sessions/CartItemList/useCartItemList.ts`
- Expor `onAdd(product)` via `addItem` do store

#### `modules/cart/features/cart-view/sessions/CartItemList/CartItemList.tsx`
- Substituir botão "Remover" por controle inline:
  ```
  [−]  {quantity}  [+]
  ```
  - `[−]` → `onRemove(product.id)` — remove item inteiro
  - `[+]` → `onAdd(product)` — incrementa quantidade

### Critérios de aceite

- [ ] Produto sem adição → botão índigo "Adicionar ao carrinho"
- [ ] Produto adicionado 1× → botão verde "No carrinho: 1"
- [ ] Produto adicionado 3× → botão verde "No carrinho: 3"
- [ ] Remover pelo carrinho (clicar `−`) → botão na listagem volta para índigo
- [ ] Layout `/cart` full-width sem margens laterais visíveis
- [ ] Clicar `+` no carrinho → quantidade e subtotal atualizados imediatamente
- [ ] Clicar `−` → item removido, badge do header decrementado
- [ ] `selectItemQuantity` acessível via `modules/cart` (public API)

### Testes E2E

- [ ] Produto não adicionado → `add-to-cart-button` com texto "Adicionar ao carrinho"
- [ ] Clicar 1× → botão com "No carrinho: 1" e cor verde
- [ ] Clicar mais 2× → "No carrinho: 3"
- [ ] Ir para `/cart`, clicar `cart-item-remove` → voltar para home → botão volta para "Adicionar ao carrinho"
- [ ] Na página `/cart` → conteúdo encosta nas bordas da viewport (sem margens brancas laterais)
- [ ] Clicar `cart-item-add` → `cart-item-quantity` incrementa, `cart-total` atualizado
- [ ] Clicar `cart-item-remove` → item desaparece, `header-cart-badge` decrementado

---

## Regras de arquitetura (resumo rápido)

> Detalhes completos em `.claude/rules/`

1. **Módulo** = domínio (`catalog`, `cart`). Cada módulo tem `index.ts` como única porta de saída.
2. **Feature** = capacidade do usuário (`product-list`, `cart-view`). Código interno nunca é importado diretamente de fora.
3. **Session** = componente exclusivo de uma feature. Nunca compartilhado entre features.
4. **Hook/Presentation split**: `use<Name>.ts` tem todo estado e lógica; `<Name>.tsx` chama o hook e renderiza JSX. Sem `useState`/`useEffect` na presentation.
5. **Sem barrel dentro de session folder** — importar sempre pelo arquivo direto.
6. **`shared/core/components/`** = primitivos sem conhecimento de domínio. Pode usar public API de módulos como consumidor externo.

### Imports proibidos (exemplos)

```ts
// ❌ path interno de módulo
import { cartStore } from 'modules/cart/store/cart.store'

// ❌ import entre features irmãs
import { LoginSession } from 'modules/auth/features/login/sessions/LoginSession/LoginSession'

// ❌ barrel dentro de session
import { useCartItemList } from '../CartItemList'   // index.ts dentro de session

// ✅ sempre pela public API
import { useCartStore } from 'modules/cart'
```

---

## Formatação de moeda

Usar `formatBRL` de `shared/utils/format.ts`:

```ts
export const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
```

Exemplo: `19999.99` → `"R$ 19.999,99"`

---

## Checklist final (todas as etapas)

### Funcional
- [ ] 20 produtos carregados na home
- [ ] Paginação: 10 por página, botões desabilitados nos extremos
- [ ] Busca filtra em tempo real e reseta para página 1
- [ ] Busca sem resultado exibe mensagem
- [ ] Adicionar produto → badge do header atualiza
- [ ] Botão por produto reflete quantidade atual (índigo/verde)
- [ ] Carrinho exibe itens, subtotais e total corretos
- [ ] Controle `− qty +` por item no carrinho
- [ ] Remover item → some da lista, total e badge atualizados
- [ ] Estado do carrinho persiste após reload
- [ ] Navegação entre `/` e `/cart` sem reload (SPA)
- [ ] 404 para rotas inexistentes

### Arquitetura
- [ ] Nenhum path interno exposto fora do módulo
- [ ] Nenhuma feature importa outra feature irmã
- [ ] Nenhum `index.ts` dentro de pasta de session
- [ ] Presentations sem `useState`, `useEffect`, `useNavigate`
- [ ] `shared/core/components/` sem lógica de domínio nos componentes (hooks podem acessar stores via public API)
- [ ] `app/` importa apenas public APIs dos módulos

### Testes E2E
- [ ] Todos os cenários de cada etapa passando
