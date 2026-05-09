# Criar página de listagem de produtos com paginação e ação de adicionar ao carrinho

## Contexto

Esta é a tela principal da aplicação. O usuário precisa ver os produtos disponíveis, navegar entre páginas (10 itens por página), buscar produtos por nome/descrição e adicionar qualquer produto ao carrinho. Depende da task 01 (service mockado e store do carrinho) e da task 02 (Header).

---

## Escopo de alteração

### Módulos impactados
- `modules/catalog/features/product-list/sessions/` — sessions da feature de listagem
- `modules/catalog/features/product-list/index.tsx` — exporta o entry point da feature

### Arquivos-chave esperados

- `modules/catalog/features/product-list/sessions/ProductListSession/ProductListSessionLayout.tsx` — layout puro: `<main>` com `bg-gray-50`, `max-w-7xl`, `px-4 py-8`; aceita `children`; sem hook
- `modules/catalog/features/product-list/sessions/ProductListSession/useProductListSession.ts` — chama `getProducts()`, controla `currentPage` e `query`; calcula `filteredProducts` (case-insensitive em `name` e `description`), `totalPages`, `paginatedProducts` (slice de 10); expõe `onNext`, `onPrev`, `onQueryChange` (`onQueryChange` reseta `currentPage` para `1`)
- `modules/catalog/features/product-list/sessions/ProductListSession/ProductListSession.tsx` — chama `useProductListSession()` no topo; passa todos os valores para `<ProductGrid />`; sem lógica própria
- `modules/catalog/features/product-list/sessions/ProductGrid/useProductGrid.ts` — lê `addItem` e `items` do store via `useCartStore`; expõe `onAddToCart(product)` e `getQuantity(productId): number`
- `modules/catalog/features/product-list/sessions/ProductGrid/ProductGrid.tsx` — chama `useProductGrid()` no topo; props: `products`, `currentPage`, `totalPages`, `query`, `onNext`, `onPrev`, `onQueryChange`; sem `useState`/`useEffect`

### Estrutura visual do `ProductGrid`
- Título "Produtos"
- Campo de busca acima do grid
- Grid de cards: imagem `h-48 object-cover`, nome, descrição `line-clamp-2`, preço em BRL, botão add
- Botão: **índigo** com "Adicionar ao carrinho" quando `qty === 0`; **verde** com "No carrinho: N" quando `qty > 0`
- Controles de paginação: botões Anterior/Próximo e texto "Página X de Y"
- Quando `products.length === 0`: exibir `<p data-testid="empty-search-message">Nenhum produto encontrado</p>`

### `data-testid` obrigatórios

| testid | Elemento |
|---|---|
| `product-grid` | Container do grid |
| `product-card` | Cada card (10 por página) |
| `add-to-cart-button` | Botão dentro de cada card |
| `pagination-prev` | Botão "Anterior" |
| `pagination-next` | Botão "Próximo" |
| `pagination-info` | Texto "Página X de Y" |
| `search-input` | Campo de busca |
| `empty-search-message` | Mensagem quando nenhum resultado |

### Entry point

```tsx
// modules/catalog/features/product-list/index.tsx
export function ProductListPage() {
  return (
    <ProductListSessionLayout>
      <ProductListSession />
    </ProductListSessionLayout>
  )
}
```

---

## Testes E2E necessários

- [ ] Página 1 → 10 `product-card` visíveis
- [ ] Clicar `pagination-next` → `pagination-info` exibe "Página 2 de 2"
- [ ] Na página 2 → `pagination-next` está `disabled`
- [ ] Clicar `pagination-prev` → volta para "Página 1 de 2"
- [ ] Na página 1 → `pagination-prev` está `disabled`
- [ ] Clicar `add-to-cart-button` do 1º produto → `header-cart-badge` exibe `1`
- [ ] Clicar 2× no mesmo produto → botão exibe "No carrinho: 2"
- [ ] `search-input` visível na home
- [ ] Digitar "MacBook" → apenas cards com "MacBook" no nome/descrição visíveis
- [ ] Digitar "xyznotexist" → `empty-search-message` visível
- [ ] Limpar campo → `product-grid` com 10 cards (página 1)
- [ ] Busca com resultado em 1 página → `pagination-next` `disabled`
- [ ] Ir para página 2, digitar algo → volta para página 1

---

## Definition of Done (DoD)

- [ ] Implementação entregue e funcionando localmente
- [ ] Exatamente 10 produtos por página, paginação client-side
- [ ] Botões de navegação desabilitados corretamente nos extremos (primeira/última página)
- [ ] `ProductGrid.tsx` sem `useState`, `useEffect` — toda lógica nos hooks
- [ ] Campo de busca filtra em tempo real por `name` e `description` (case-insensitive)
- [ ] Busca reseta `currentPage` para `1` ao digitar
- [ ] Busca sem resultado exibe `empty-search-message`
- [ ] Botão de produto reflete quantidade atual: índigo (`qty === 0`) ou verde (`qty > 0`)
- [ ] Adicionar ao carrinho atualiza badge do header reativamente
- [ ] Sessions não importam umas às outras fora do próprio feature folder
- [ ] Sem violações de arquitetura
- [ ] Testes E2E listados acima passando
- [ ] PR aprovado com ao menos 1 review
