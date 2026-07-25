import jsPDF from "jspdf";
import { ContratoFormData, PessoaContrato } from "../types/contrato";
import { valorPorExtenso } from "../utils/numeroPorExtenso";

function formatarMoeda(valor: string) {
  const numero = Number(valor);
  if (!valor || isNaN(numero)) return "R$ 0,00";
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataBR(valor: string) {
  if (!valor) return "____/____/______";
  const [ano, mes, dia] = valor.split("-");
  if (!ano || !mes || !dia) return valor;
  return `${dia}/${mes}/${ano}`;
}

function formatarDataPorExtenso(valor: string) {
  if (!valor) return "____ de __________ de ______";
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
    "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  const [ano, mes, dia] = valor.split("-");
  if (!ano || !mes || !dia) return valor;
  return `${Number(dia)} de ${meses[Number(mes) - 1]} de ${ano}`;
}

function qualificacaoPessoa(p: PessoaContrato): string {
  const partes = [
    p.nacionalidade,
    p.estadoCivil && `${p.estadoCivil}${p.regimeBens ? ` em regime de ${p.regimeBens}` : ""}`,
    p.nascimento && `nascido(a) em ${formatarDataBR(p.nascimento)}`,
    p.cpf && `portador(a) do CPF/MF nº ${p.cpf}`,
    p.rg && `RG nº ${p.rg}${p.orgaoEmissor ? ` ${p.orgaoEmissor}` : ""}`,
    p.email && `e-mail ${p.email}`,
    p.telefone && `telefone ${p.telefone}`,
  ]
    .filter(Boolean)
    .join(", ");

  const endereco = [
    p.endereco,
    p.bairro,
    p.cidade && p.uf ? `${p.cidade}-${p.uf}` : p.cidade,
    p.cep && `CEP: ${p.cep}`,
  ]
    .filter(Boolean)
    .join(", ");

  return `${p.nome.toUpperCase()}, ${partes}, residente e domiciliado(a) em ${endereco}`;
}

function carregarImagemBase64(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function gerarContratoPDF(form: ContratoFormData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margem = 20;
  const larguraUtil = 210 - margem * 2;
  let y = 20;

  const logoBase64 = await carregarImagemBase64("/logo/dunna-site.png");

  function novaLinhaSePrecisar(altura = 8) {
    if (y + altura > 270) {
      rodape();
      doc.addPage();
      cabecalho();
    }
  }

  function rodape() {
    const pagina = doc.getNumberOfPages();
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margem, 280, margem + larguraUtil, 280);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      "Dunna Imóveis · CNPJ 55.297.958/0001-88 · CRECI-PE 19602-J",
      margem,
      285
    );
    doc.text(`página ${pagina}`, margem + larguraUtil, 285, {
      align: "right",
    });
  }

  function cabecalho() {
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", margem, 12, 40, 16);
      } catch {}
    }

    doc.setDrawColor(200, 169, 106);
    doc.setLineWidth(0.6);
    doc.line(margem, 32, margem + larguraUtil, 32);

    y = 42;
  }

  cabecalho();

  function tituloClausula(texto: string) {
    novaLinhaSePrecisar(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(20, 20, 20);
    const linhas = doc.splitTextToSize(texto.toUpperCase(), larguraUtil);
    doc.text(linhas, margem, y);
    y += linhas.length * 5 + 3;
  }

  function paragrafo(texto: string, opcoes: { negrito?: boolean } = {}) {
    doc.setFont("helvetica", opcoes.negrito ? "bold" : "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const linhas = doc.splitTextToSize(texto, larguraUtil);
    novaLinhaSePrecisar(linhas.length * 5 + 4);
    doc.text(linhas, margem, y, { align: "justify", maxWidth: larguraUtil });
    y += linhas.length * 5 + 4;
  }

  function itemLista(texto: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const linhas = doc.splitTextToSize(`•  ${texto}`, larguraUtil - 4);
    novaLinhaSePrecisar(linhas.length * 5 + 3);
    doc.text(linhas, margem + 3, y);
    y += linhas.length * 5 + 3;
  }

  // Cabeçalho
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text("CONTRATO PARTICULAR DE PROMESSA", 105, y, { align: "center" });
  y += 6;
  doc.text("DE COMPRA E VENDA DE IMÓVEL", 105, y, { align: "center" });
  y += 12;

  paragrafo("Pelo presente instrumento particular, de um lado:");

  // Vendedores
  tituloClausula(form.vendedores.length > 1 ? "VENDEDORES:" : "VENDEDOR(A):");
  form.vendedores.forEach((v, i) => {
    paragrafo(
      (i > 0 ? "e " : "") + qualificacaoPessoa(v) + "."
    );
  });

  paragrafo("E de outro lado:");

  // Compradores
  tituloClausula(
    form.compradores.length > 1 ? "COMPRADORES:" : "COMPRADOR(A):"
  );
  form.compradores.forEach((c, i) => {
    paragrafo(
      (i > 0 ? "e " : "") +
        qualificacaoPessoa(c) +
        (i === form.compradores.length - 1
          ? `, doravante denominado(a) simplesmente ${
              form.compradores.length > 1 ? "COMPRADORES" : "COMPRADOR(A)"
            }.`
          : ",")
    );
  });

  paragrafo("Têm entre si justo e contratado o que segue:");

  // Cláusula 1
  tituloClausula("Cláusula 1 – Do Objeto");
  paragrafo(
    `O presente contrato tem como objeto a promessa de compra e venda do seguinte imóvel: ${form.imovelTipo} nº ${form.imovelNumero}${
      form.imovelPavimento ? `, situado no ${form.imovelPavimento}` : ""
    }${form.imovelEdificio ? ` do Edifício ${form.imovelEdificio}` : ""}, localizado em ${form.imovelEndereco}.`
  );
  paragrafo(
    `O imóvel encontra-se registrado sob matrícula nº ${form.imovelMatricula}, no Cartório de Registro de Imóveis de ${form.imovelCartorio}, onde constam suas medidas, confrontações e demais características em sua certidão de inteiro teor e ônus.`
  );
  if (form.imovelSequencial || form.imovelInscricaoImobiliaria) {
    paragrafo(
      `Sequencial nº ${form.imovelSequencial}${
        form.imovelInscricaoImobiliaria
          ? ` e inscrição imobiliária nº ${form.imovelInscricaoImobiliaria}`
          : ""
      } perante a ${form.imovelPrefeitura || "Prefeitura Municipal"}.`
    );
  }

  if (form.temAlienacao) {
    paragrafo(
      `(A) O imóvel encontra-se alienado ao banco ${form.bancoAlienacao} por motivo de financiamento bancário, devidamente registrado no cartório de registro de imóveis competente.`
    );
  }

  paragrafo(
    "Os VENDEDORES declaram ser legítimos proprietários do referido imóvel, comprometendo-se a entregá-lo, após quitação total da venda, livre, desimpedido e desembaraçado de quaisquer ônus, dívidas ou gravames."
  );

  // Cláusula 2
  tituloClausula("Cláusula 2 – Do Preço e Pagamento");
  paragrafo(
    `O valor total da presente promessa de compra e venda imobiliária é de ${formatarMoeda(
      form.valorTotal
    )} (${valorPorExtenso(Number(form.valorTotal) || 0)}), correspondente exclusivamente ao imóvel descrito na Cláusula 1.`
  );
  paragrafo(
    "Os bens móveis eventualmente existentes no imóvel são objeto de negociação autônoma entre as partes, formalizada em instrumento contratual próprio, não integrando o preço ora ajustado."
  );
  paragrafo("A ser pago da seguinte maneira:");
  paragrafo(
    `(A) Sinal – ${formatarMoeda(form.valorSinal)} (${valorPorExtenso(
      Number(form.valorSinal) || 0
    )}) ${form.formaSinal || "na assinatura deste contrato, a título de sinal"}.`
  );
  paragrafo(
    `(B) Saldo – ${formatarMoeda(form.valorSaldo)} (${valorPorExtenso(
      Number(form.valorSaldo) || 0
    )}) ${form.formaSaldo || "a ser pago mediante assinatura da escritura pública de compra e venda"}.`
  );
  if (form.bancoVendedor) {
    paragrafo(
      `Dados bancários para pagamento: Banco ${form.bancoVendedor}, agência ${form.agenciaVendedor}, conta corrente nº ${form.contaVendedor}, favorecido(a) ${form.favorecidoVendedor}.`
    );
  }

  // Cláusula 3
  tituloClausula("Cláusula 3 – Da Posse do Imóvel");
  paragrafo(
    "A posse do imóvel, entrega de chaves, senhas e troca de titularidade condominial ao(à) COMPRADOR(A) ocorrerá após a quitação total do valor da venda."
  );

  // Cláusula 4
  tituloClausula("Cláusula 4 – Da Escritura e Registro");
  paragrafo(
    "A escritura pública definitiva de compra e venda, o ITBI e o registro junto ao cartório de registro de imóveis são de inteira e total responsabilidade do(a) COMPRADOR(A)."
  );

  // Cláusula 5
  tituloClausula("Cláusula 5 – Da Vistoria e Estado do Imóvel");
  paragrafo(
    "O(A) COMPRADOR(A) declara ter visitado e vistoriado previamente o imóvel objeto deste contrato, estando ciente de suas condições físicas, estruturais e de conservação."
  );
  paragrafo(
    "Os VENDEDORES comprometem-se a entregar o imóvel em plenas condições de uso e habitabilidade, livre de bens ou objetos pessoais que não façam parte da venda."
  );

  // Cláusula 6
  tituloClausula("Cláusula 6 – Das Obrigações dos Vendedores");
  paragrafo("Os VENDEDORES comprometem-se a:");
  itemLista("Entregar o imóvel livre de quaisquer dívidas ou ônus.");
  itemLista(
    "Apresentar toda documentação necessária para lavratura da escritura e registro do imóvel."
  );
  itemLista("Garantir ao(à) COMPRADOR(A) a posse mansa e pacífica do imóvel.");
  itemLista(
    "Após a quitação do financiamento (se houver), providenciar a baixa da alienação fiduciária e apresentar matrícula atualizada livre do gravame no prazo máximo de 30 dias."
  );
  itemLista(
    "Disponibilizar toda a documentação necessária para a lavratura da escritura pública em até 30 dias da confirmação da quitação, incluindo certidões que demonstrem inexistência de débitos, ações judiciais ou restrições que possam comprometer a transferência da propriedade."
  );
  itemLista(
    "Responder por quaisquer débitos, multas, tributos, taxas condominiais ou encargos cuja origem seja anterior à imissão do(a) COMPRADOR(A) na posse, ainda que descobertos posteriormente."
  );

  // Cláusula 7
  tituloClausula("Cláusula 7 – Das Obrigações do(a) Comprador(a)");
  paragrafo("O(A) COMPRADOR(A) compromete-se a:");
  itemLista("Realizar os pagamentos nas datas acordadas neste contrato.");
  itemLista("Assumir as despesas cartoriais e tributos da transferência.");
  itemLista(
    "Após a posse, assumir todas as despesas referentes ao imóvel, incluindo IPTU, condomínio e demais taxas e encargos, caso existam."
  );

  // Cláusula 8
  tituloClausula("Cláusula 8 – Da Rescisão e Multa Contratual");
  paragrafo(
    "Em caso de desistência por parte do(a) COMPRADOR(A), os VENDEDORES reterão 10% (dez por cento) do valor total do contrato, a título de multa compensatória."
  );
  paragrafo(
    "Caso a desistência seja por parte dos VENDEDORES, estes deverão devolver todos os valores pagos pelo(a) COMPRADOR(A), acrescidos de multa de 10% (dez por cento) sobre o valor total do contrato. A devolução deverá ocorrer no prazo máximo de 10 (dez) dias, contados da formalização da desistência."
  );
  paragrafo(
    "(A) Não será considerada desistência por parte do(a) COMPRADOR(A) quando houver irregularidade documental, ônus não informados, ações judiciais relevantes ou impossibilidade de transferência da propriedade. Nessas hipóteses, todos os valores pagos serão devolvidos integralmente, corrigidos pelo IPCA."
  );
  paragrafo(
    "(B) Os VENDEDORES respondem integralmente pela evicção, nos termos dos artigos 447 e seguintes do Código Civil."
  );
  paragrafo(
    "(C) O atraso superior a 15 dias no cumprimento das obrigações assumidas sujeitará os VENDEDORES à multa moratória de 2% sobre o valor total do contrato."
  );

  // Cláusula 9
  tituloClausula("Cláusula 9 – Da Irrevogabilidade e Irretratabilidade");
  paragrafo(
    "O presente contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes, seus herdeiros e sucessores ao fiel cumprimento de todas as cláusulas aqui estabelecidas."
  );

  // Cláusula 10
  tituloClausula("Cláusula 10 – Da Intermediação Imobiliária");
  paragrafo(
    "A presente negociação foi intermediada pela empresa DUNNA IMÓVEIS, inscrita no CNPJ nº 55.297.958/0001-88, devidamente registrada no Conselho Regional de Corretores de Imóveis sob nº 19602-J."
  );
  paragrafo(
    `A comissão de corretagem foi ajustada entre as partes no valor de ${formatarMoeda(
      form.valorComissao
    )} (${valorPorExtenso(Number(form.valorComissao) || 0)}), a ser paga pelo(s) VENDEDOR(ES) no ato de assinatura da escritura e recebimento do valor de saldo conforme Cláusula 2, item (B), deste contrato.`
  );
  paragrafo(
    "O(A) COMPRADOR(A) não responderá, em nenhuma hipótese, pelo pagamento da corretagem, nem solidária nem subsidiariamente."
  );
  if (form.bancoComissao) {
    paragrafo(
      `Dados bancários para pagamento: Banco ${form.bancoComissao}, agência ${form.agenciaComissao}, conta corrente ${form.contaComissao}${
        form.pixComissao ? `, Chave Pix ${form.pixComissao}` : ""
      }, favorecido ${form.favorecidoComissao}.`
    );
  }

  // Cláusula 11
  tituloClausula("Cláusula 11 – Do Foro");
  paragrafo(
    `Fica eleito o foro da comarca de ${form.foroCidade}, com renúncia de qualquer outro, por mais privilegiado que seja, para dirimir quaisquer dúvidas oriundas do presente contrato.`
  );

  paragrafo(
    "E por estarem assim justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma."
  );

  novaLinhaSePrecisar(10);
  paragrafo(
    `${form.cidadeAssinatura || form.foroCidade}, ${formatarDataPorExtenso(form.dataAssinatura)}.`
  );

  // Assinaturas
  novaLinhaSePrecisar(30);
  y += 10;

  function linhaAssinatura(nome: string, papel: string) {
    novaLinhaSePrecisar(20);
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.3);
    doc.line(margem, y, margem + larguraUtil, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(nome.toUpperCase(), 105, y, { align: "center" });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(papel, 105, y, { align: "center" });
    y += 12;
  }

  form.compradores.forEach((c) =>
    linhaAssinatura(c.nome, form.compradores.length > 1 ? "Comprador(a)" : "Comprador(a)")
  );
  form.vendedores.forEach((v) => linhaAssinatura(v.nome, "Vendedor(a)"));

  novaLinhaSePrecisar(24);
  const meioColuna = margem + larguraUtil / 2;

  doc.setDrawColor(80, 80, 80);
  doc.line(margem, y, margem + 75, y);
  doc.line(meioColuna + 10, y, meioColuna + 10 + 75, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("TESTEMUNHA", margem, y);
  doc.text("TESTEMUNHA", meioColuna + 10, y);
  y += 6;

  doc.text(`Nome: ${form.testemunha1Nome || "_______________________"}`, margem, y);
  doc.text(`Nome: ${form.testemunha2Nome || "_______________________"}`, meioColuna + 10, y);
  y += 6;

  doc.text(`CPF: ${form.testemunha1Cpf || "_______________________"}`, margem, y);
  doc.text(`CPF: ${form.testemunha2Cpf || "_______________________"}`, meioColuna + 10, y);

  rodape();

  const nomeArquivo = `Contrato-${form.compradores[0]?.nome || "sem-nome"}-${Date.now()}.pdf`;
  doc.save(nomeArquivo);
}
