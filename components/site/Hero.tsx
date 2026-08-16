"use client";

import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import AnimatedNumber from "./AnimatedNumber";

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
// baixar DEPOIS que a página termina de carregar, em todas as telas
// (inclusive celular), pra não atrapalhar o carregamento inicial.
const VIDEO_URL =
  "https://clzlssjyhgiiiyjcrvtk.supabase.co/storage/v1/object/public/imoveis/careneiros-comprimido.mp4";

export default function Hero() {
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

    // Vídeo habilitado em todas as telas (inclusive celular) — depois
    // da compressão ele ficou leve o suficiente (6MB) pra valer a
    // experiência visual. Espera a página terminar de carregar antes de pedir o vídeo,
    // pra não disputar banda com a imagem e outros recursos críticos.
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
    <section className="relative overflow-hidden bg-navy">

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
        className="absolute inset-0 h-full w-full object-cover opacity-70"
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
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoPronto ? "opacity-70" : "opacity-0"
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/55 to-navy/25" />

      <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-6 py-20">

        <div className="max-w-3xl">

          <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 font-sans text-sm font-medium tracking-wide text-gold">
            ESPECIALISTAS EM IMÓVEIS DE PRAIA
          </span>

          <h1 className="mt-8 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">

            Viva o melhor do litoral.

            <br />

            Invista com segurança.

          </h1>

          <p className="mt-8 max-w-2xl font-sans text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">

            Apartamentos, casas e empreendimentos selecionados em
            Porto de Galinhas, Muro Alto, Praia dos Carneiros,
            Tamandaré e São Miguel dos Milagres.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              href="/site/imoveis"
              className="rounded-2xl bg-gold px-8 py-4 font-sans text-lg font-semibold text-white transition hover:bg-gold-dark"
            >
              Ver imóveis
            </Link>

            <Link
              href="/site/empreendimentos"
              className="rounded-2xl border border-white/30 px-8 py-4 font-sans text-lg font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              Empreendimentos
            </Link>

          </div>

          <div className="mt-14 inline-flex items-center gap-8 rounded-2xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-sm sm:gap-10">

            <div>

              <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">
                <AnimatedNumber numero={10} prefixo="+" />
              </h3>

              <p className="mt-2 font-sans text-sm text-slate-100 sm:text-base">
                anos de mercado
              </p>

            </div>

            <div className="h-12 w-px bg-white/20" />

            <div>

              <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">
                <AnimatedNumber numero={5} />
              </h3>

              <p className="mt-2 font-sans text-sm text-slate-100 sm:text-base">
                regiões atendidas
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
