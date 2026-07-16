interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TextField({
  label,
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-[#C8A96A] focus:ring-2 focus:ring-[#C8A96A]/20"
      />

    </div>
  );
}