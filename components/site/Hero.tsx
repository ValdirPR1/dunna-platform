"use client";

import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import AnimatedNumber from "./AnimatedNumber";
import { useIdioma } from "@/features/idioma/IdiomaContext";

// Essa imagem é o elemento LCP (Largest Contentful Paint) da home —
// o que o Google mede pra saber se a página carregou rápido. Antes
// ela pedia 2000px de largura e não tinha prioridade de carregamento,
// o que atrasava o LCP pra mais de 5s no celular (medido no PageSpeed
// Insights). Reduzindo a largura pedida e marcando como alta
// prioridade (fetchPriority + preload), o navegador baixa essa foto
// antes de qualquer outra coisa na página.
//
// No desktop o LCP já ficou ótimo (0,8s), mas no celular (rede 4G
// simulada mais lenta do teste do Google) ainda estava em 4,2s — a
// largura de 1600px pedia mais bytes do que o necessário pra uma tela
// de celular. Reduzindo pra 1200px e a qualidade pra 65, o arquivo
// fica bem mais leve sem perda visível (a imagem cobre o banner via
// object-cover, então não precisa de resolução nativa alta).
const POSTER_URL =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=65";

// O vídeo de fundo original pesava quase 50MB e demorava mais de 15s
// pra carregar, competindo com a imagem crítica (LCP) pela banda do
// visitante. Depois de comprimido (49,7MB -> 6MB) ele só começa a
// baixar DEPOIS que a página termina de carregar — e, desde o ajuste
// mais recente, só em telas de tablet/computador pra cima (ver
// matchMedia no useEffect abaixo).
const VIDEO_URL =
  "https://clzlssjyhgiiiyjcrvtk.supabase.co/storage/v1/object/public/imoveis/careneiros-comprimido.mp4";

export default function Hero() {
  const { t } = useIdioma();

  // A imagem do LCP vem de um domínio externo (Unsplash), não do
  // nosso próprio site. Isso significa que, além de baixar a imagem
  // em si, o navegador precisa primeiro abrir uma conexão nova (DNS +
  // TLS) com esse domínio — e em rede de celular simulada mais lenta,
  // só essa etapa pode custar 1-2s sozinha, o que explica o LCP variar
  // bastante entre testes (às vezes 4,2s, às vezes 5,4s). O
  // preconnect abaixo manda o navegador começar essa conexão assim
  // que a página começa a carregar, em paralelo com o resto, em vez
  // de só quando descobre o preload da imagem — reduz esse custo.
  preconnect("https://images.unsplash.com", { crossOrigin: "anonymous" });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Controla o "crossfade" entre a imagem estática e o vídeo: o vídeo
  // só fica visível (opacity-70) depois que já tem frame pra mostrar.
  // Enquanto isso ele fica com opacity-0 — e um elemento com opacity 0
  // não conta pro cálculo do LCP do Google, então quem "pinta" a tela
  // primeiro pro navegador é sempre a <img>, nunca o <video>.
  const [videoPronto, setVideoPronto] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // O vídeo (5,9MB mesmo comprimido) só entra em telas maiores que
    // celular. Medindo com o PageSpeed Insights, mesmo carregando
    // DEPOIS da página pronta, decodificar esse vídeo consome
    // processamento bem na hora que o Google mede a "pintura" da
    // tela no celular (rede simulada mais lenta + processador mais
    // fraco) — e ainda gasta o pacote de dados de quem tá no 4G. No
    // computador a banda e o processamento sobram, então não há
    // motivo pra abrir mão da experiência visual lá.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const carregarVideo = () => {
      const source = document.createElement("source");
      source.src = VIDEO_URL;
      source.type = "video/mp4";
      video.appendChild(source);
      video.addEventListener("loadeddata", () => setVideoPronto(true), { once: true });
      video.load();
      video.play().catch(() => {});
    };

    if (document.readyState === "complete") {
      carregarVideo();
    } else {
      window.addEventListener("load", carregarVideo, { once: true });
      return () => window.removeEventListener("load", carregarVideo);
    }
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy">

      <link rel="preload" as="image" href={POSTER_URL} fetchPriority="high" />

      {/* Essa <img> é o elemento que o navegador realmente pinta
          primeiro (o LCP) — <video> tem um jeito mais lento de ser
          "pintado" na tela mesmo com poster, o que estava deixando o
          LCP do banner em 5s+ no celular. Ela fica sempre visível por
          baixo; o vídeo entra por cima com um fade suave assim que
          tem o primeiro frame pronto (ver videoPronto acima). */}
      <img
        src={POSTER_URL}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      {/* Vídeo da Praia dos Carneiros — fonte adicionada via JS depois
          do carregamento inicial (ver useEffect acima) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoPronto ? "opacity-80" : "opacity-0"
        }`}
      />

      {/* Escurece de baixo pra cima (onde ficam os textos) e um pouco
          no topo, pra o menu branco sempre ter contraste */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-28 pt-40 sm:pb-32">

        <div className="max-w-3xl">

          <span className="entrada-luxo rotulo-luxo flex items-center text-white/85">
            <span className="fio-luxo" />
            {t.hero.badge}
          </span>

          <h1
            className="entrada-luxo-2 mt-8 font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl"
            style={{ fontWeight: 200 }}
          >

            {t.hero.titulo1}

            <br />

            <span className="text-gold-light">
              {t.hero.titulo2}
            </span>

          </h1>

          <p className="entrada-luxo-3 mt-8 max-w-xl font-sans text-base font-light leading-8 text-white/80 sm:text-lg">

            {t.hero.descricao}

          </p>

          <div className="entrada-luxo-3 mt-10 flex flex-wrap gap-4">

            <Link
              href="/site/imoveis"
              className="rotulo-luxo bg-gold px-9 py-4 text-white transition hover:bg-gold-dark"
            >
              {t.hero.verImoveis}
            </Link>

            <Link
              href="/site/empreendimentos"
              className="rotulo-luxo border border-white/50 px-9 py-4 text-white transition hover:bg-white hover:text-navy"
            >
              {t.hero.empreendimentos}
            </Link>

          </div>

        </div>

        <div className="mt-16 flex items-center gap-10 border-t border-white/20 pt-8 sm:gap-14">

          <div>

            <p className="font-display text-4xl font-extralight text-white sm:text-5xl">
              <AnimatedNumber numero={10} prefixo="+" />
            </p>

            <p className="rotulo-luxo mt-2 text-white/60">
              {t.hero.anosMercado}
            </p>

          </div>

          <div className="h-12 w-px bg-white/20" />

          <div>

            <p className="font-display text-4xl font-extralight text-white sm:text-5xl">
              <AnimatedNumber numero={5} />
            </p>

            <p className="rotulo-luxo mt-2 text-white/60">
              {t.hero.regioesAtendidas}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
