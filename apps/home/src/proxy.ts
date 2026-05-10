import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Dev (multi-app / multi-zones Next): o browser fica em :3000, mas cada app secundária
 * corre noutro processo (:3001…). Este proxy reescreve o pedido para a origem certa
 * (equivale às rewrites do next.config).
 *
 * Em produção use reverse proxy na borda (nginx/CDN); aqui só roda com NODE_ENV=development.
 */
type SecondaryAppSlug = "jsonplaceholder" | "pokemon" | "rick-and-morty";

const secondaryAppOrigins: Record<SecondaryAppSlug, string> = {
  jsonplaceholder:
    process.env.JSONPLACEHOLDER_APP_ORIGIN ?? "http://127.0.0.1:3001",
  pokemon: process.env.POKEMON_APP_ORIGIN ?? "http://127.0.0.1:3002",
  "rick-and-morty":
    process.env.RICK_AND_MORTY_APP_ORIGIN ?? "http://127.0.0.1:3003",
};

const secondaryAppSlugs: SecondaryAppSlug[] = [
  "jsonplaceholder",
  "pokemon",
  "rick-and-morty",
];

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  for (const slug of secondaryAppSlugs) {
    const prefix = `/${slug}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const origin = secondaryAppOrigins[slug];
      const destination = new URL(
        `${pathname}${request.nextUrl.search}`,
        origin,
      );
      return NextResponse.rewrite(destination);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/jsonplaceholder",
    "/jsonplaceholder/:path*",
    "/pokemon",
    "/pokemon/:path*",
    "/rick-and-morty",
    "/rick-and-morty/:path*",
  ],
};
