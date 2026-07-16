interface Props
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function TextArea({
  label,
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        {...props}
        className="min-h-[140px] w-full rounded-xl border border-slate-300 bg-white p-4 outline-none transition focus:border-[#C8A96A] focus:ring-2 focus:ring-[#C8A96A]/20"
      />

    </div>
  );
}