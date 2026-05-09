import Image from "next/image";
import type { ReactNode } from "react";

export type CardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
};

export function Card({
  imageSrc,
  imageAlt,
  title,
  description,
  footer,
  className,
}: CardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm transition-shadow hover:shadow-md ${className ?? ""}`}
    >
      <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-[var(--color-foreground)]">
          {title}
        </h2>
        {description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">
            {description}
          </p>
        ) : null}
        {footer ? <div className="mt-auto pt-2">{footer}</div> : null}
      </div>
    </article>
  );
}
