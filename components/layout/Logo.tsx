import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center py-6">
      <Image
        src="/dunna-plataform.png"
        alt="Dunna Platform"
        width={190}
        height={70}
        priority
      />
    </div>
  );
}