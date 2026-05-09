import { ModuleBackNav } from "@/shared/components/module-back-nav/ModuleBackNav";

export default function JsonPlaceholderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ModuleBackNav />
      {children}
    </>
  );
}
