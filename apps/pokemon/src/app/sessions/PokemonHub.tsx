import { PokemonHubCta } from "./PokemonHubCta";
import { PokemonHubHeader } from "./PokemonHubHeader";

export function PokemonHub() {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <PokemonHubHeader />
      <PokemonHubCta />
    </div>
  );
}
