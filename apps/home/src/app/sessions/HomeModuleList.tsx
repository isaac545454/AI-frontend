import { pluginManifests } from "@next-modular-arch/module-registry/registry";

export function HomeModuleList() {
  return (
    <ul className="flex flex-col gap-4">
      {pluginManifests.map((item) => (
        <li key={item.id}>
          {/*
            Navegação hard para as zonas: o host não declara essas rotas no App Router;
            em dev `src/proxy.ts` reescreve o pedido para a origem da zona (outra porta).
          */}
          <a
            href={item.homeHref}
            className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm transition-colors hover:border-zinc-500 hover:shadow-md"
          >
            <span className="block text-lg font-medium text-[var(--color-foreground)]">
              {item.displayName}
            </span>
            <span className="mt-1 block text-sm text-[var(--color-muted)]">
              {item.description}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
