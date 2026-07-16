interface Props {
  current: number;
  steps: string[];
}

export default function Stepper({
  current,
  steps,
}: Props) {
  return (
    <div className="mb-10 flex items-center gap-4">

      {steps.map((step, index) => {

        const active = index === current;

        return (
          <div
            key={step}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[#C8A96A] text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {step}
          </div>
        );

      })}
    </div>
  );
}