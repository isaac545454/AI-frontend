# Criar página do carrinho com listagem de itens, resumo e controle de quantidade

## Contexto

O usuário precisa ver o que adicionou ao carrinho, a quantidade de cada item, o valor total e poder ajustar quantidades com controle `− qty +` por item. Esta tela consome o store do carrinho criado na task 01 e usa o Header criado na task 02.

---

## Escopo de alteração

### Módulos impactados
- `modules/cart/features/cart-view/sessions/` — sessions da feature de visualização do carrinho
- `modules/cart/features/cart-view/index.tsx` — exporta o entry point da feature
- `modules/cart/index.ts` — garante que `CartViewPage` está exportado

### Arquivos-chave esperados

- `modules/cart/features/cart-view/sessions/CartSession/CartSessionLayout.tsx` — layout **full-width**: sem `max-w-*`, sem `mx-auto`, sem padding lateral; `<main className="min-h-screen bg-gray-50"><div className="w-full py-8">{children}</div></main>`; sem hook
- `modules/cart/features/cart-view/sessions/CartSession/useCartSession.ts` — lê `items` do store via `useCartStore`; retorna `{ items }`
- `modules/cart/features/cart-view/sessions/CartSession/CartSession.tsx` — chama `useCartSession()` no topo; passa `items` para `<CartItemList />`; sem lógica própria
- `modules/cart/features/cart-view/sessions/CartItemList/useCartItemList.ts` — props: `{ items: CartItem[] }`; lê `removeItem` e `addItem` do store; calcula `total = Σ (product.price × quantity)`; expõe `total`, `onRemove(productId)`, `onAdd(product)`
- `modules/cart/features/cart-view/sessions/CartItemList/CartItemList.tsx` — props: `{ items: CartItem[] }`; chama `useCartItemList({ items })` no topo; sem `useState`/`useEffect`

### Estrutura visual do `CartItemList`
- **Empty state** (`items.length === 0`): mensagem centralizada (`data-testid="cart-empty"`)
- **Lista**: cada item com imagem `h-20 w-20`, nome, preço unitário, subtotal, controle `− qty +`
  - `[−]` chama `onRemove(product.id)` — remove item inteiro
  - número exibe a quantidade atual
  - `[+]` chama `onAdd(product)` — incrementa quantidade
- Footer com total geral em destaque

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

### Entry point

```tsx
// modules/cart/features/cart-view/index.tsx
export function CartViewPage() {
  return (
    <CartSessionLayout>
      <CartSession />
    </CartSessionLayout>
  )
}
```

---

## Testes E2E necessários

- [ ] `/cart` sem itens → `cart-empty` visível, `cart-item-list` ausente
- [ ] Adicionar produto na home, ir para `/cart` → produto listado com qty `1`
- [ ] Mesmo produto adicionado 3× → `cart-item-quantity` exibe `3`, `cart-item-subtotal` = preço × 3
- [ ] Clicar `cart-item-remove` → item some, `cart-total` recalculado
- [ ] Remover todos → `cart-empty` visível
- [ ] Clicar `cart-item-add` → `cart-item-quantity` incrementa
- [ ] Layout `/cart` → conteúdo encosta nas bordas da viewport (sem margens brancas laterais)

---

## Definition of Done (DoD)

- [ ] Implementação entregue e funcionando localmente
- [ ] Carrinho vazio exibe `cart-empty` (sem lista vazia ou erro)
- [ ] Subtotal por item e total geral calculados corretamente em BRL
- [ ] Controle `− qty +` por item: `−` remove item inteiro, `+` incrementa quantidade
- [ ] Remoção de item atualiza o store e o badge do header reativamente
- [ ] `CartItemList.tsx` sem `useState`, `useEffect` — toda lógica no hook
- [ ] Layout full-width sem `max-w-*` ou `mx-auto`
- [ ] Testes E2E listados acima passando
- [ ] Sem violações de arquitetura
- [ ] PR aprovado com ao menos 1 review
