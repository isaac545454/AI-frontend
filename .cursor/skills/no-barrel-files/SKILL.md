---
name: no-barrel-files
description: >-
  Este repositório não usa barrel files. Nunca criar `index.ts` / `index.tsx`
  que só re-exportam outros módulos. Importar sempre do arquivo que declara
  o símbolo (caminho explícito até `.ts`/`.tsx`).
---

# Sem barrel files

## Regra

- **Proibido:** `index.ts` ou `index.tsx` cuja única função seja agregar `export { X } from "./..."` (barrel).
- **Obrigatório:** importar do arquivo-fonte, por exemplo `@/shared/components/card/Card`, `@/payment/features/checkout/CheckoutPage`.

## Fronteiras entre domínios

- O contrato é o **arquivo canônico** (nome e pasta estáveis), não um barrel na raiz do domínio.
- Outro domínio importa o caminho direto da API que precisa; não há “API pública” via `index.ts`.

## Shared

- Importar de `@/shared/...` até o arquivo concreto (`components/`, `lib/`, etc.), **não** de `@/shared` agregador.
