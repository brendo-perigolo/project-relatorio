import { Injectable } from "@angular/core";
import { PDFDocument, rgb } from "pdf-lib";

@Injectable({
  providedIn: "root",
})
export class PdfServiceService {
  private signatureImage: string | null = null;
  private fileName: string = "";
  private AssinaturaTecnico: string = "key";
  private horaEntradaInput = "";
  private responsavelInput = "";
  private dateInput: any = "";
  private tecnico: string = "Autocom Manhuaçu";

  async importPdf(file: File): Promise<PDFDocument> {
    const arrayBuffer = await file.arrayBuffer();
    return PDFDocument.load(arrayBuffer);
  }

  setSignatureImage(image: string | null) {
    this.signatureImage = image;
  }

  setFileName(name: string) {
    this.fileName = name;
  }

  setData() {
    const data = new Date();
    this.dateInput = data.toLocaleDateString();
  }

  setTimeEntrada(entrada: string) {
    this.horaEntradaInput = entrada;
  }

  setResponsavel(responsavel: string) {
    this.responsavelInput = responsavel;
  }

  async editPdf(pdfDoc: PDFDocument, text: string): Promise<Uint8Array> {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Desenha retângulo branco para limpar a área de texto
    firstPage.drawRectangle({
      x: width * 0.0,
      y: height * 0.08,
      width: width * 1,
      height: height * 0.45,
      color: rgb(1, 1, 1),
    });

    firstPage.drawRectangle({
      x: width * 0.0,
      y: height * 0.0,
      width: width * 1,
      height: height * 0.3,
      color: rgb(1, 1, 1),
    });

    // Defina variáveis para controle de texto
    const startY = height * 0.43; // Posição inicial do Y para o texto
    const lineHeight = height * 0.02; // Altura da linha
    const textSize = height * 0.011; // Tamanho do texto

    const columnWidth = (width - 2 * (width * 0.08)) / 2; // Largura das colunas
    const textMargin = width * 0.08; // Margem das colunas

    // Divida o texto em linhas
    const lines = text.split("\n");

    let y = startY;
    let column = 0;
    const columnLines: string[][] = [[], []]; // Array para armazenar as linhas de cada coluna

    lines.forEach((line) => {
      // Adiciona linha à coluna atual
      columnLines[column].push(line);
      if (columnLines[column].join("\n").split("\n").length * lineHeight > height * 0.2) {
        // Se a coluna está cheia, mude para a próxima coluna
        column = 1;
        y = startY;
      }
    });

    // Desenha o texto nas duas colunas
    columnLines.forEach((columnLines, colIndex) => {
      const x = textMargin + colIndex * (columnWidth + textMargin);
      columnLines.forEach((line, index) => {
        firstPage.drawText(line, {
          x: x,
          y: y - index * lineHeight,
          size: textSize,
          maxWidth: columnWidth,
        });
      });
    });

    // Adiciona Data Atendimento
    const dataAtual = new Date();
    const dataAtualString = dataAtual.toLocaleDateString();

    firstPage.drawText(`Data Atendimento : ${dataAtualString}`, {
      x: width * 0.1,
      y: height * 0.138,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Adicionar Hora de Entrada
    firstPage.drawText(`Hora Entrada / Hora saída :  ${this.horaEntradaInput} /  `, {
      x: width * 0.1,
      y: height * 0.118,
      size: 11,
      color: rgb(0, 0, 0),
    });

    // Adicionar Hora de Saída
    const currentDate = new Date();
    const timeString = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    firstPage.drawText(`${timeString}`, {
      x: width * 0.4,
      y: height * 0.118,
      size: 11,
      color: rgb(0, 0, 0),
    });

    // Adicionar linha pontilhada acima da data e hora
    this.drawDashedLine(firstPage, 0.1 * width, 0.158 * height, 0.9 * width, 0.158 * height, 0.5);

    // Adicionar Assinatura do Técnico
    const tecnicoSignature = this.getTecnicoSignature();
    if (tecnicoSignature) {
      const signatureImageBytes = await fetch(tecnicoSignature).then((res) => res.arrayBuffer());
      const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);
      const signatureScale = 0.1;
      const signatureWidth = signatureImageEmbed.width * signatureScale;
      const signatureHeight = signatureImageEmbed.height * signatureScale;

      // Definir posições
      const lineY = height * 0.06; // Linha em Y
      const signatureY = lineY + 50; // Assinatura um pouco acima da linha
      const textBelowLineY = lineY - 15; // Texto abaixo da linha

      // Adicionar linha para a assinatura do técnico
      this.drawLine(firstPage, width * 0.08, lineY, width * 0.45, lineY, 0.5);

      // Adicionar assinatura do técnico
      firstPage.drawImage(signatureImageEmbed, {
        x: width * 0.08 + (width * 0.45 - signatureWidth) / 2, // Centralizar horizontalmente
        y: signatureY - signatureHeight, // Assinatura um pouco acima da linha
        width: signatureWidth,
        height: signatureHeight,
      });

      // Adicionar texto do técnico abaixo da linha
      const tecnicoTextWidth = this.measureTextWidth(this.tecnico, 11);
      firstPage.drawText(this.tecnico, {
        x: (width * 0.08 + width * 0.45 - tecnicoTextWidth) / 2,
        y: textBelowLineY, // Texto abaixo da linha
        size: 11,
        color: rgb(0, 0, 0),
      });
    }

    // Adicionar Assinatura do Cliente
    const clienteSignature = this.signatureImage;
    if (clienteSignature) {
      const signatureImageBytes = await fetch(clienteSignature).then((res) => res.arrayBuffer());
      const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);
      const signatureScale = 0.1;
      const signatureWidth = signatureImageEmbed.width * signatureScale;
      const signatureHeight = signatureImageEmbed.height * signatureScale;

      // Definir posições
      const lineY = height * 0.06; // Linha em Y
      const signatureY = lineY + 50; // Assinatura um pouco acima da linha
      const textBelowLineY = lineY - 15; // Texto abaixo da linha

      // Adicionar linha para a assinatura do cliente
      this.drawLine(firstPage, width * 0.55, lineY, width * 0.95, lineY, 0.5);

      // Adicionar assinatura do cliente
      firstPage.drawImage(signatureImageEmbed, {
        x: width * 0.55 + (width * 0.95 - signatureWidth - width * 0.55) / 2, // Centralizar horizontalmente
        y: signatureY - signatureHeight, // Assinatura um pouco acima da linha
        width: signatureWidth,
        height: signatureHeight,
      });

      // Adicionar texto do cliente abaixo da linha
      const responsavelTextWidth = this.measureTextWidth(this.responsavelInput, 11);
      firstPage.drawText(this.responsavelInput, {
        x: width * 0.55 + (width * 0.95 - responsavelTextWidth - width * 0.55) / 2,
        y: textBelowLineY, // Texto abaixo da linha
        size: 11,
        color: rgb(0, 0, 0),
      });
    }

    // Adicionar texto final
    const finalText = "eSistemLoja - A Solução Completa na medida Certa! (0800 591 3107)";
    const finalTextWidth = this.measureTextWidth(finalText, 10);
    firstPage.drawText(finalText, {
      x: (width - finalTextWidth) / 2,
      y: height * 0.02,
      size: 10,
      color: rgb(0, 0, 0),
    });

    return pdfDoc.save();
  }

  async generatePdf(data: Uint8Array): Promise<Blob> {
    return new Blob([data], { type: "application/pdf" });
  }

  private getTecnicoSignature(): string | null {
    return localStorage.getItem("key");
  }

  private drawLine(page: any, x1: number, y1: number, x2: number, y2: number, thickness: number) {
    page.drawRectangle({
      x: x1,
      y: y1 - thickness / 2,
      width: x2 - x1,
      height: thickness,
      color: rgb(0, 0, 0),
    });
  }

  private drawDashedLine(
    page: any,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    thickness: number
  ) {
    const dashLength = 5;
    const gapLength = 5;
    const totalLength = x2 - x1;
    let currentX = x1;

    while (currentX < x2) {
      page.drawRectangle({
        x: currentX,
        y: y1 - thickness / 2,
        width: Math.min(dashLength, x2 - currentX),
        height: thickness,
        color: rgb(0, 0, 0),
      });
      currentX += dashLength + gapLength;
    }
  }

  private measureTextWidth(text: string, fontSize: number): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = `${fontSize}px Arial`;
      return context.measureText(text).width;
    }
    return 0;
  }
}
