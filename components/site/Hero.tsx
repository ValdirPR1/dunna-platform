"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import AnimatedNumber from "./AnimatedNumber";

// Essa imagem é o elemento LCP (Largest Contentful Paint) da home —
// o que o Google mede pra saber se a página carregou rápido. Antes
// ela pedia 2000px de largura e não tinha prioridade de carregamento,
// o que atrasava o LCP pra mais de 5s no celular (medido no PageSpeed
// Insights). Reduzindo a largura pedida e marcando como alta
// prioridade (fetchPriority + preload), o navegador baixa essa foto
// antes de qualquer outra coisa na página.
const POSTER_URL =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70";

// O vídeo de fundo (careneiros.MP4) pesa quase 50MB e demora mais de
// 15s pra carregar. Ele estava competindo com a imagem crítica pela
// banda do visitante logo na abertura da página, o que piorava o
// tempo de carregamento — especialmente no celular. Agora ele só
// começa a baixar DEPOIS que a página termina de carregar, e só em
// telas maiores (celular fica só com a imagem, economizando dados de
// quem acessa pelo 4G/5G).
const VIDEO_URL =
  "https://clzlssjyhgiiiyjcrvtk.supabase.co/storage/v1/object/public/imoveis/careneiros-comprimido.mp4";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Só carrega o vídeo em telas de tablet/desktop pra cima (768px+).
    // No celular, que é o que o Google usa pra medir nossa nota de
    // performance, mostramos só a imagem — mais rápido e mais barato
    // pra quem está usando dados móveis.
    const ehTelaGrande = window.matchMedia("(min-width: 768px)").matches;
    if (!ehTelaGrande) return;

    // Espera a página terminar de carregar antes de pedir o vídeo,
    // pra não disputar banda com a imagem e outros recursos críticos.
    const carregarVideo = () => {
      const source = document.createElement("source");
      source.src = VIDEO_URL;
      source.type = "video/mp4";
      video.appendChild(source);
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

      {/* Vídeo da Praia dos Carneiros — fonte adicionada via JS depois
          do carregamento inicial (ver useEffect acima) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={POSTER_URL}
        // @ts-expect-error -- fetchPriority em <video> ainda não está
        // tipado pelo React, mas é um atributo HTML válido e ajuda o
        // navegador a priorizar o carregamento da imagem de poster.
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
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
