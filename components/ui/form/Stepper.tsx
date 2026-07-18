interface Props {
  current: number;
  steps: string[];
  onStepClick?: (index: number) => void;
}

export default function Stepper({
  current,
  steps,
  onStepClick,
}: Props) {
  return (
    <div className="mb-10 flex flex-wrap items-center gap-4">

      {steps.map((step, index) => {

        const active = index === current;

        return (
          <button
            key={step}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onStepClick?.(index);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[#C8A96A] text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {step}
          </button>
        );

      })}
    </div>
  );
}
