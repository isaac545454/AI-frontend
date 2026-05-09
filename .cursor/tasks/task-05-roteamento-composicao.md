# Configurar roteamento e composição do app shell

## Contexto

Com as duas páginas implementadas (tasks 03 e 04), o app shell precisa orquestrar as rotas com TanStack Router (file-based) e montar o layout com o Header em ambas. Esta task conecta todos os módulos no ponto de composição (`app/`), garantindo que a navegação entre listagem e carrinho funcione corretamente.

---

## Escopo de alteração

### Módulos impactados
- `app/routes/` — rotas file-based do TanStack Router
- `main.tsx` — entrada da aplicação com `RouterProvider`

### Arquivos-chave esperados

- `app/routes/__root.tsx` — layout root: `Header` + `<Outlet />`; `notFoundComponent` com mensagem 404
- `app/routes/index.tsx` — rota `/` → `ProductListPage`
- `app/routes/cart.tsx` — rota `/cart` → `CartViewPage`
- `app/routeTree.gen.ts` — gerado automaticamente pelo TanStack Router (não editar manualmente)
- `main.tsx` — cria o router com `routeTree` gerado, renderiza `<RouterProvider />`; sem providers adicionais (Zustand não precisa de Provider)

### Conteúdo esperado

```tsx
// app/routes/__root.tsx
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

// app/routes/index.tsx
export const Route = createFileRoute('/')({ component: ProductListPage })

// app/routes/cart.tsx
export const Route = createFileRoute('/cart')({ component: CartViewPage })
```

---

## Testes E2E necessários

- [ ] Acessar `/` → `product-grid` visível com `Header`
- [ ] Acessar `/cart` → `cart-empty` ou `cart-item-list` visível com `Header`
- [ ] Clicar `header-cart-button` na home → URL `/cart`
- [ ] Clicar `header-logo` no carrinho → URL `/`
- [ ] Acessar `/inexistente` → texto "404" visível
- [ ] Navegação entre `/` e `/cart` preserva estado do carrinho (SPA, sem reload)

---

## Definition of Done (DoD)

- [ ] Implementação entregue e funcionando localmente
- [ ] Rotas `/` e `/cart` funcionando sem reload manual (SPA)
- [ ] Header aparece em ambas as páginas com badge reativo ao estado do carrinho
- [ ] `app/` importa módulos apenas pela public API (`modules/catalog`, `modules/cart`) — sem paths internos
- [ ] Navegação entre as duas páginas preserva o estado do carrinho
- [ ] Rota inexistente exibe componente 404
- [ ] Testes E2E listados acima passando
- [ ] Sem violações de arquitetura
- [ ] PR aprovado com ao menos 1 review
