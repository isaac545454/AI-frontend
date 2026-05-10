export function HomeHeader() {
  return (
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
        Módulos de exemplo
      </h1>
      <p className="text-base leading-relaxed text-[var(--color-muted)]">
        Três módulos independentes, cada um com listagem paginada,{" "}
        <span className="text-[var(--color-foreground)]">
          card e paginação compartilhados
        </span>{" "}
        nos pacotes{" "}
        <span className="font-mono text-sm">@next-modular-arch/ui-data</span> e{" "}
        <span className="font-mono text-sm">@next-modular-arch/http</span>.
      </p>
    </header>
  );
}
