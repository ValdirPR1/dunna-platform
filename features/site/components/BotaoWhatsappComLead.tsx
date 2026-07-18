"use client";

import { useState } from "react";
import ContatoWhatsappModal from "./ContatoWhatsappModal";

interface Props {
  label: string;
  mensagemWhatsapp: string;
  origem: string;
  className: string;
}

export default function BotaoWhatsappComLead({
  label,
  mensagemWhatsapp,
  origem,
  className,
}: Props) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button onClick={() => setAberto(true)} className={className}>
        {label}
      </button>

      <ContatoWhatsappModal
        aberto={aberto}
        onFechar={() => setAberto(false)}
        mensagemWhatsapp={mensagemWhatsapp}
        origem={origem}
      />
    </>
  );
}
