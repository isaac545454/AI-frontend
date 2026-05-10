import { RickAndMortyHubCta } from "./RickAndMortyHubCta";
import { RickAndMortyHubHeader } from "./RickAndMortyHubHeader";

export function RickAndMortyHub() {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <RickAndMortyHubHeader />
      <RickAndMortyHubCta />
    </div>
  );
}
