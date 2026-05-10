"use client";

import type { MouseEvent } from "react";

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

function hostHomeHref() {
  const origin = process.env.NEXT_PUBLIC_HOST_ORIGIN?.replace(/\/$/, "");
  return origin ? `${origin}/` : "/";
}

/** Sai da zona sem soft navigation do Next (o router da zona não conhece `/`). */
function forceDocumentNavigation(
  url: string,
  event: MouseEvent<HTMLAnchorElement>,
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  window.location.assign(url);
}

export function ModuleBackNav() {
  const homeHref = hostHomeHref();

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
        <a
          href={homeHref}
          onClick={(e) => forceDocumentNavigation(homeHref, e)}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
        >
          <ArrowLeftIcon className="shrink-0" />
          <span>Módulos</span>
        </a>
      </div>
    </div>
  );
}
