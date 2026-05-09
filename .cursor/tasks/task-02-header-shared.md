# Criar componente Header compartilhado com contador do carrinho

## Contexto

As duas páginas da aplicação precisam de um header comum. Por ser um primitivo de UI sem lógica de domínio específica, mas que exibe informação do carrinho (contador de itens), ele deve viver em `shared/core/components/`. O contador precisa ser reativo ao store do carrinho.

---

## Escopo de alteração

### Módulos impactados
- `shared/core/components/Header/` — novo componente core com split hook/presentation
- `modules/cart/index.ts` — pode precisar exportar o seletor de contagem de itens

### Arquivos-chave esperados
- `shared/core/components/Header/useHeader.ts` — lê `selectTotalItems` do store via `useCartStore`; expõe `cartItemCount` e `onCartClick` (navega para `/cart` via `useNavigate`)
- `shared/core/components/Header/Header.tsx` — chama `useHeader()` no topo; renderiza logo, botão do carrinho com badge; sem `useState`/`useEffect`

### Estrutura visual esperada
- `sticky top-0 z-50` com `border-b` e shadow
- Logo "Shop" à esquerda linkado para `/`
- Botão do carrinho à direita com ícone `ShoppingCart` (lucide-react), texto "Carrinho" e badge absoluto
- Badge: `opacity-0` quando `cartItemCount === 0`, `opacity-100` quando `> 0`

### `data-testid` obrigatórios

| testid | Elemento |
|---|---|
| `header-logo` | Link do logo |
| `header-cart-button` | Botão do carrinho |
| `header-cart-badge` | Badge numérico |

---

## Testes E2E necessários

- [ ] Carrinho vazio → badge com `opacity-0` (ou oculto)
- [ ] Adicionar 3 produtos → badge exibe `3`
- [ ] Clicar `header-cart-button` → URL muda para `/cart`
- [ ] Clicar `header-logo` na página do carrinho → URL muda para `/`

---

## Definition of Done (DoD)

- [ ] Implementação entregue e funcionando localmente
- [ ] `Header` segue o split hook/presentation conforme `session-architecture.md`: `useHeader.ts` com toda lógica, `Header.tsx` só renderiza JSX
- [ ] `Header.tsx` sem `useState`, `useEffect`, `useNavigate` — toda lógica no hook
- [ ] Badge do carrinho é reativo: atualiza sem reload ao adicionar/remover itens
- [ ] `Header` importa store apenas via public API (`modules/cart`) — sem paths internos
- [ ] Testes E2E listados acima passando
- [ ] Sem violações de arquitetura
- [ ] PR aprovado com ao menos 1 review
