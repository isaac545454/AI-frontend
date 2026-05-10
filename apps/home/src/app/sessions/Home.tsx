import { HomeHeader } from "./HomeHeader";
import { HomeModuleList } from "./HomeModuleList";

export function Home() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-10 px-6 py-16">
      <HomeHeader />
      <HomeModuleList />
    </div>
  );
}
