export function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-[13px] uppercase tracking-wide text-ink-faint">
        {label}
      </legend>
      <div className="mt-3 flex flex-col gap-2.5">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2.5 text-[15px] text-ink-soft hover:text-ink"
          >
            <input
              type="checkbox"
              checked={selected.has(option)}
              onChange={() => onToggle(option)}
              className="mu-checkbox"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
