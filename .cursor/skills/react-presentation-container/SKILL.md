---
name: react-presentation-container
description: >-
  Aplica o padrão Presentation/Container em React. Use ao criar ou refatorar
  componentes React, separar componente e hook, extrair lógica de UI para
  hooks, ou quando o usuário mencionar presentation container.
---

# React Presentation/Container

## Regra principal

- O componente deve focar em renderização: JSX, composição visual, props para filhos, classes e estados visuais.
- Toda lógica de UI deve ficar em um hook dedicado: estado, efeitos, queries, mutations, handlers, filtros, ordenação, paginação, seleção e derivações.
- O hook não deve retornar JSX nem componentes; retorne dados, flags e callbacks com nomes explícitos.
- Não criar barrel files (`index.ts` / `index.tsx`). Importe sempre do arquivo que declara o símbolo.

## Estrutura padrão

Use nomes próximos ao componente, respeitando o padrão local:

```text
features/<feature>/
├── FeatureName.tsx
└── useFeatureName.ts
```

Quando a lógica acessar API, persistência ou integração externa, coloque a chamada reutilizável em `services/` conforme as regras do projeto, e chame esse service a partir do hook.

## Workflow

1. Leia o componente existente e arquivos próximos antes de editar.
2. Crie ou atualize um hook `use<NomeDoComponente>` na mesma feature.
3. Mova para o hook qualquer `useState`, `useEffect`, `useMemo`, `useCallback`, data fetching, validação, handlers e lógica condicional não visual.
4. Deixe no componente apenas a chamada ao hook, o destructuring do retorno e o JSX.
5. Prefira retornos explícitos do hook:

```typescript
return {
  items,
  isLoading,
  error,
  selectedItem,
  handleSelectItem,
};
```

6. Evite objetos genéricos como `state`, `actions` ou `handlers` quando nomes diretos deixarem o componente mais claro.
7. Após editar, verifique lints nos arquivos alterados.

## Checklist

- [ ] O componente não contém estado, efeitos ou regras de negócio.
- [ ] O hook concentra a lógica de UI e expõe uma API simples para o componente.
- [ ] Chamadas externas reutilizáveis estão em `services/`, não dentro do JSX.
- [ ] Imports usam caminhos diretos, sem barrels.
- [ ] Nomes de arquivos, hooks e componentes seguem o padrão já existente na feature.
