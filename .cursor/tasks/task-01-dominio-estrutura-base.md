# Criar domínio e estrutura base (módulos, types, services e store)

## Contexto

Antes de qualquer tela existir, o projeto precisa de uma fundação: os módulos de domínio, os types compartilhados, os services mockados e o store do carrinho. Sem isso, as demais tasks não têm onde ancorar seu código e os imports cruzariam fronteiras de domínio sem contrato definido.

---

## Escopo de alteração

### Módulos impactados
- `modules/catalog/` — novo módulo de catálogo de produtos
- `modules/catalog/features/product-list/services/` — service mockado com 20 produtos
- `modules/catalog/types/` — tipo `Product`
- `modules/cart/` — novo módulo de carrinho
- `modules/cart/store/` — store Zustand com persist middleware
- `modules/cart/types/` — tipo `CartItem`
- `modules/catalog/index.ts` — public API do módulo catalog
- `modules/cart/index.ts` — public API do módulo cart

### Arquivos-chave esperados

#### `modules/catalog/types/catalog.types.ts`
Interface `Product`:
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
- Array local `PRODUCTS` com exatamente **20 produtos** (eletrônicos, cada um com todos os campos preenchidos)
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
- Actions:
  - `addItem(product)` — se produto já existe, incrementa quantidade; senão, adiciona com `quantity: 1`
  - `removeItem(productId)` — remove o item inteiro (não decrementa)
  - `clearCart()` — esvazia o array
- Seletores exportados:
  - `selectTotalItems(state)` — soma de todas as quantidades (não número de produtos distintos)
  - `selectItemQuantity(productId: string)` — retorna função seletor `(state) => number` que devolve a quantidade daquele produto (0 se não adicionado)

#### `modules/cart/index.ts`
```ts
export { useCartStore, selectTotalItems, selectItemQuantity } from './store/cart.store'
export type { CartItem } from './types/cart.types'
export { CartViewPage } from './features/cart-view/index'
```

---

## Testes E2E necessários

Não se aplica nesta task — sem UI entregue. Cobertura E2E fica nas tasks de UI (tasks 3 e 4).

---

## Definition of Done (DoD)

- [ ] Implementação entregue e funcionando localmente
- [ ] `modules/catalog` e `modules/cart` criados com estrutura de pastas correta segundo `feature-sliced.md` e `modular-architecture.md`
- [ ] 20 produtos eletrônicos mockados no `productService` com todos os campos preenchidos
- [ ] `addItem` incrementa quantidade se produto já existe
- [ ] `removeItem` remove o item inteiro (não decrementa para zero)
- [ ] `persist` ativo — estado do carrinho sobrevive a reload da página (chave `'cart-storage'`)
- [ ] `selectTotalItems` retorna soma das quantidades (não número de produtos distintos)
- [ ] `selectItemQuantity(id)` retorna `0` para produto não adicionado
- [ ] `index.ts` público de cada módulo exporta apenas o necessário — sem paths internos expostos
- [ ] Sem violações de arquitetura (sem imports cruzados entre módulos por caminhos internos)
- [ ] PR aprovado com ao menos 1 review
