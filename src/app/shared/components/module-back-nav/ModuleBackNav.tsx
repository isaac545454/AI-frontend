import Link from "next/link";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ModuleBackNav() {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
        >
          <ArrowLeftIcon className="shrink-0" />
          <span>Módulos</span>
        </Link>
      </div>
    </div>
  );
}
