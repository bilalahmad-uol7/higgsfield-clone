export function PromptBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-white-40">Prompt</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what you want to generate…"
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-white-8 bg-surface-tertiary p-3 text-sm text-white-90 placeholder:text-white-40 focus:border-white-24 focus:outline-none"
      />
    </div>
  );
}
