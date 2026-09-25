export function PromptBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="prompt" className="slate text-white-40">
          Prompt
        </label>
        <span className="slate text-white-24">{value.length} chr</span>
      </div>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the shot like you'd brief a DP — subject, light, lens, mood…"
        rows={5}
        className="mt-2 w-full resize-none border border-white-10 bg-ink p-3 text-[15px] leading-relaxed text-paper placeholder:text-white-24 focus:border-rec focus:outline-none"
      />
    </div>
  );
}
