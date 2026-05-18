export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block bg-white/5 border-l-4 border-signal px-4 py-2 mb-6">
      <span className="text-signal font-bold tracking-[0.3em] uppercase text-[10px]">
        {children}
      </span>
    </div>
  );
}
