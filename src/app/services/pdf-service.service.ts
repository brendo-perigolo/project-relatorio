import { Injectable } from "@angular/core";
import { PDFDocument, rgb } from "pdf-lib";

@Injectable({
  providedIn: "root",
})
export class PdfServiceService {
  constructor() {}

  async importPdf(file: File): Promise<PDFDocument> {
    const arrayBuffer = await file.arrayBuffer();
    return PDFDocument.load(arrayBuffer);
  }

  async editPdf(pdfDoc: PDFDocument, text: string): Promise<Uint8Array> {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add text to the first page
    firstPage.drawText(text, {
      x: 50,
      y: 430,
      size: 9,
      color: rgb(0, 0, 0),
    });

    return pdfDoc.save();
  }

  async generatePdf(data: Uint8Array): Promise<Blob> {
    return new Blob([data], { type: "application/pdf" });
  }
}
