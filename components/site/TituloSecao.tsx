interface Props {
  tag: string;
  titulo: string;
  descricao?: string;
  // Fundo escuro: textos claros
  claro?: boolean;
  // Centraliza (usado em chamadas de fim de página)
  centro?: boolean;
}

// Cabeçalho padrão das seções do site: etiqueta pequena em caixa alta
// com fio dourado, título fino e grande, texto de apoio.
export default function TituloSecao({
  tag,
  titulo,
  descricao,
  claro = false,
  centro = false,
}: Props) {
  return (
    <div className={centro ? "text-center" : undefined}>

      <span
        className={`rotulo-luxo flex items-center ${
          centro ? "justify-center" : ""
        } ${claro ? "text-gold-light" : "text-gold-dark"}`}
      >
        <span className="fio-luxo" />
        {tag}
      </span>

      <h2
        className={`mt-5 break-words font-display text-4xl leading-tight sm:text-5xl lg:text-6xl ${
          claro ? "text-white" : "text-navy"
        }`}
      >
        {titulo}
      </h2>

      {descricao && (
        <p
          className={`mt-5 max-w-2xl font-sans text-lg font-light leading-8 ${
            centro ? "mx-auto" : ""
          } ${claro ? "text-white/70" : "text-slate-500"}`}
        >
          {descricao}
        </p>
      )}

    </div>
  );
}
