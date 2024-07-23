import { Injectable } from "@angular/core";
import { PDFDocument, rgb } from "pdf-lib";

@Injectable({
  providedIn: "root",
})
export class PdfServiceService {
  constructor() {}

  private signatureImage: string | null = null;

  async importPdf(file: File): Promise<PDFDocument> {
    const arrayBuffer = await file.arrayBuffer();
    return PDFDocument.load(arrayBuffer);
  }

  setSignatureImage(image: string | null) {
    this.signatureImage = image;
  }

  async editPdf(pdfDoc: PDFDocument, text: string): Promise<Uint8Array> {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add text to the first page
    firstPage.drawText(text, {
      x: 50,
      y: 430,
      size: 12,
      color: rgb(0, 0, 0),
    });
    if (this.signatureImage) {
      // Adiciona a assinatura ao PDF
      const signatureImageBytes = await fetch(this.signatureImage).then((res) => res.arrayBuffer());
      const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);

      const { width, height } = signatureImageEmbed;

      const xPosition = 320; // Ajuste a posição X conforme necessário
      const yPosition = 60; // Ajuste a posição Y conforme necessário

      // Reduz o tamanho da assinatura
      const scale = 0.4; // Reduza o tamanho para 50% do original
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      firstPage.drawImage(signatureImageEmbed, {
        x: xPosition,
        y: yPosition,
        width: scaledWidth,
        height: scaledHeight,
      });
    }
    return pdfDoc.save();
  }

  async generatePdf(data: Uint8Array): Promise<Blob> {
    return new Blob([data], { type: "application/pdf" });
  }
}
