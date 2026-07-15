import Button from "./Button";

interface Props {
  title: string;
  subtitle: string;
  buttonText?: string;
  onClick?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  buttonText,
  onClick,
}: Props) {
  return (
    <div className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-2 text-zinc-400">
          {subtitle}
        </p>
      </div>

      {buttonText && (
        <Button onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}