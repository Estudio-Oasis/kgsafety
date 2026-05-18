export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-signal text-anchor px-4 py-2 mb-6 shadow-[4px_4px_0_0_var(--anchor-fixed)]">
      <span className="w-1.5 h-1.5 bg-anchor rounded-full" />
      <span className="font-bold tracking-[0.25em] uppercase text-[10px]">
        {children}
      </span>
    </div>
  );
}
