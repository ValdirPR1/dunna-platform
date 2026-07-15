import Card from "./Card";

interface Props {
  title: string;
  value: string;
  growth?: string;
}

export default function StatCard({
  title,
  value,
  growth,
}: Props) {
  return (
    <Card>
      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-white">
        {value}
      </h2>

      {growth && (
        <p className="mt-2 text-sm text-green-400">
          {growth}
        </p>
      )}
    </Card>
  );
}