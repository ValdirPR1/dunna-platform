// Gera o feed de imóveis no formato VRSync (padrão do Grupo ZAP,
// usado também pelo VivaReal) — é o mesmo formato que o time de
// implantação da Lais pediu, pra ela conseguir ler os imóveis
// disponíveis pra venda e oferecer no papo com o lead.
//
// Documentação oficial: https://developers.grupozap.com/feeds/vrsync/

export interface ImovelFeed {
  id: string;
  codigo: string | null;
  titulo: string;
  slug: string;
  tipo: string | null;
  status: string | null;
  descricao: string | null;
  cidade: string | null;
  bairro: string | null;
  endereco: string | null;
  cep: string | null;
  preco: number | null;
  condominio: number | null;
  iptu: number | null;
  iptu_periodicidade: string | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  area_privativa: number | null;
  area_total: number | null;
  latitude: number | null;
  longitude: number | null;
  video_url: string | null;
  fotos: string[];
}

export interface ConfigFeed {
  nomeEmpresa: string;
  email: string;
  telefone: string;
  website: string;
  logoUrl: string;
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// A gente guarda "tipo" e "status" como texto livre no cadastro (pra
// facilitar o dia a dia de quem cadastra), mas o VRSync exige um
// elemento fechado (PropertyType). Essa função tenta encaixar o texto
// livre no valor mais parecido da tabela oficial do Grupo ZAP.
export function mapearTipoImovel(tipoBruto: string | null): {
  usageType: string;
  propertyType: string;
} {
  const tipo = normalizar(tipoBruto ?? "");

  if (tipo.includes("terreno") || tipo.includes("lote")) {
    return { usageType: "Residential", propertyType: "Residential / Land Lot" };
  }
  if (tipo.includes("chacara") || tipo.includes("sitio") || tipo.includes("fazenda")) {
    return { usageType: "Residential", propertyType: "Residential / Agricultural" };
  }
  if (tipo.includes("cobertura")) {
    return { usageType: "Residential", propertyType: "Residential / Penthouse" };
  }
  if (tipo.includes("flat")) {
    return { usageType: "Residential", propertyType: "Residential / Flat" };
  }
  if (tipo.includes("loft")) {
    return { usageType: "Residential", propertyType: "Residential / Loft" };
  }
  if (tipo.includes("kitnet") || tipo.includes("conjugado")) {
    return { usageType: "Residential", propertyType: "Residential / Kitnet" };
  }
  if (tipo.includes("studio")) {
    return { usageType: "Residential", propertyType: "Residential / Studio" };
  }
  if (tipo.includes("sobrado")) {
    return { usageType: "Residential", propertyType: "Residential / Sobrado" };
  }
  if (tipo.includes("condominio")) {
    return { usageType: "Residential", propertyType: "Residential / Condo" };
  }
  if (tipo.includes("casa")) {
    return { usageType: "Residential", propertyType: "Residential / Home" };
  }
  if (tipo.includes("consultorio")) {
    return { usageType: "Commercial", propertyType: "Commercial / Consultorio" };
  }
  if (tipo.includes("galpao") || tipo.includes("deposito") || tipo.includes("armazem")) {
    return { usageType: "Commercial", propertyType: "Commercial / Industrial" };
  }
  if (tipo.includes("sala") || tipo.includes("conjunto")) {
    return { usageType: "Commercial", propertyType: "Commercial / Office" };
  }
  if (tipo.includes("loja") || tipo.includes("ponto comercial")) {
    return { usageType: "Commercial", propertyType: "Commercial / Business" };
  }
  if (tipo.includes("predio") || tipo.includes("edificio")) {
    return { usageType: "Commercial", propertyType: "Commercial / Edificio Comercial" };
  }

  // Cobre "Apartamento", "Apartamento Duplex" e qualquer texto que a
  // gente não reconheça — apartamento é o tipo mais comum no
  // catálogo, então é o fallback mais seguro.
  return { usageType: "Residential", propertyType: "Residential / Apartment" };
}

// Alguns status de texto livre indicam que o imóvel não deveria ser
// oferecido pra um lead novo (já vendido, reservado etc). Mesmo que
// hoje nenhum imóvel publicado tenha esses status, é uma proteção
// extra além do "publicar em portais".
export function statusIndisponivel(status: string | null): boolean {
  if (!status) return false;
  const s = normalizar(status);
  return ["vendid", "reservad", "indispon", "suspens", "inativ", "alugad"].some((k) =>
    s.includes(k)
  );
}

function cdata(texto: string): string {
  return `<![CDATA[${texto.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function elCdata(tag: string, valor: string | null | undefined, atributos = ""): string {
  if (!valor) return "";
  return `<${tag}${atributos}>${cdata(valor)}</${tag}>`;
}

function elNum(
  tag: string,
  valor: number | null | undefined,
  atributos = ""
): string {
  if (valor === null || valor === undefined) return "";
  return `<${tag}${atributos}>${Math.round(valor)}</${tag}>`;
}

const SITE_URL = "https://dunnaimob.com.br";

function ehLinkYoutube(url: string | null): boolean {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export function montarListing(imovel: ImovelFeed, config: ConfigFeed): string {
  const { usageType, propertyType } = mapearTipoImovel(imovel.tipo);

  const listingId = (imovel.codigo || imovel.id).slice(0, 50);

  let quartos = imovel.quartos;
  if (propertyType === "Residential / Studio") {
    quartos = Math.max(1, quartos ?? 1);
  } else if (propertyType === "Residential / Kitnet") {
    quartos = quartos ?? 0;
  }

  const ehAreaTotal =
    propertyType === "Residential / Land Lot" ||
    propertyType === "Residential / Agricultural" ||
    propertyType === "Commercial / Industrial";

  const areaPrincipal = imovel.area_privativa ?? imovel.area_total;

  const media: string[] = [];
  if (ehLinkYoutube(imovel.video_url)) {
    media.push(`<Item medium="video">${imovel.video_url}</Item>`);
  }
  imovel.fotos.forEach((url, i) => {
    media.push(
      `<Item medium="image" caption="foto${i + 1}"${i === 0 ? ' primary="true"' : ""}>${url}</Item>`
    );
  });

  const partes = [
    `<Listing>`,
    `<ListingID>${listingId}</ListingID>`,
    elCdata("Title", imovel.titulo.slice(0, 100)),
    `<TransactionType>For Sale</TransactionType>`,
    `<PublicationType>STANDARD</PublicationType>`,
    `<DetailViewUrl>${SITE_URL}/site/imoveis/${imovel.slug}</DetailViewUrl>`,
    `<Media>${media.join("")}</Media>`,
    `<Details>`,
    `<UsageType>${usageType}</UsageType>`,
    `<PropertyType>${propertyType}</PropertyType>`,
    elCdata("Description", (imovel.descricao ?? "").slice(0, 3000)),
    elNum("ListPrice", imovel.preco, ' currency="BRL"'),
    ehAreaTotal
      ? elNum("LotArea", areaPrincipal, ' unit="square metres"')
      : elNum("LivingArea", areaPrincipal, ' unit="square metres"'),
    elNum("PropertyAdministrationFee", imovel.condominio, ' currency="BRL"'),
    imovel.iptu
      ? elNum(
          "Iptu",
          imovel.iptu,
          ` currency="BRL" period="${
            imovel.iptu_periodicidade === "anual" ? "Yearly" : "Monthly"
          }"`
        )
      : "",
    elNum("Bedrooms", quartos),
    elNum("Bathrooms", imovel.banheiros ?? 1),
    elNum("Suites", imovel.suites),
    elNum("Garage", imovel.vagas, ' type="Parking Space"'),
    `</Details>`,
    `<Location displayAddress="Street">`,
    `<Country abbreviation="BR">Brasil</Country>`,
    `<State abbreviation="PE">Pernambuco</State>`,
    elCdata("City", imovel.cidade),
    elCdata("Neighborhood", imovel.bairro),
    elCdata("Address", imovel.endereco),
    imovel.cep ? `<PostalCode>${imovel.cep}</PostalCode>` : "",
    imovel.latitude ? `<Latitude>${imovel.latitude}</Latitude>` : "",
    imovel.longitude ? `<Longitude>${imovel.longitude}</Longitude>` : "",
    `</Location>`,
    `<ContactInfo>`,
    elCdata("Name", config.nomeEmpresa),
    `<Email>${config.email}</Email>`,
    `<Website>${config.website}</Website>`,
    `<Logo>${config.logoUrl}</Logo>`,
    elCdata("OfficeName", config.nomeEmpresa),
    `<Telephone>${config.telefone}</Telephone>`,
    `</ContactInfo>`,
    `</Listing>`,
  ];

  return partes.filter(Boolean).join("\n");
}

export function montarFeedVrsync(
  imoveis: ImovelFeed[],
  config: ConfigFeed
): string {
  const agora = new Date().toISOString().slice(0, 19);

  const listings = imoveis
    .map((imovel) => montarListing(imovel, config))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns="http://www.vivareal.com/schemas/1.0/VRSync"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://www.vivareal.com/schemas/1.0/VRSync http://xml.vivareal.com/vrsync.xsd">
<Header>
<Provider>${config.nomeEmpresa}</Provider>
<Email>${config.email}</Email>
<ContactName>${config.nomeEmpresa}</ContactName>
<PublishDate>${agora}</PublishDate>
<Telephone>${config.telefone}</Telephone>
</Header>
<Listings>
${listings}
</Listings>
</ListingDataFeed>
`;
}
