export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="kg-pill mb-6">
      <span className="w-1.5 h-1.5 bg-signal rounded-full" />
      <span>{children}</span>
    </div>
  );
}
