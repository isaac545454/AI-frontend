import { JsonPlaceholderHubCta } from "./JsonPlaceholderHubCta";
import { JsonPlaceholderHubHeader } from "./JsonPlaceholderHubHeader";

export function JsonPlaceholderHub() {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <JsonPlaceholderHubHeader />
      <JsonPlaceholderHubCta />
    </div>
  );
}
