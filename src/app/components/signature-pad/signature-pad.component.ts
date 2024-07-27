import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import SignaturePad from "signature_pad";
import { PdfServiceService } from "../../services/pdf-service.service";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-signature-pad",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./signature-pad.component.html",
  styleUrl: "./signature-pad.component.scss",
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild("signaturePad") signaturePadElement!: ElementRef;
  signaturePad: any | undefined;
  signatureImage: string | null = null;

  private pdfService = inject(PdfServiceService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.signaturePadElement) {
        this.initializeSignaturePad();
      } else {
        console.error("Elemento de assinatura não encontrado.");
      }
    }
  }

  private initializeSignaturePad() {
    const canvas = this.signaturePadElement.nativeElement;
    const context = canvas.getContext("2d");

    if (context) {
      this.signaturePad = new SignaturePad(canvas, {
        minWidth: 0.5,
        maxWidth: 1.0,
        penColor: "black",
        backgroundColor: "white",
      });

      // DEFINICAO DA ESCALA DO CANVAS
      this.setCanvasSize();
      this.drawGuideLine();
    }
  }

  private drawGuideLine() {
    const canvas = this.signaturePadElement.nativeElement;
    const context = canvas.getContext("2d");
    if (context) {
      const lineY = 250; // Posição vertical da linha, ajuste conforme necessário

      context.clearRect(2, 2, canvas.width, canvas.height); // Limpa o canvas
      context.beginPath();
      context.moveTo(0, lineY);
      context.lineTo(canvas.width, lineY);
      context.strokeStyle = "red"; // Cor da linha guia
      context.lineWidth = 1; // Espessura da linha guia
      context.stroke();
    }
  }

  private setCanvasSize() {
    const canvas = this.signaturePadElement.nativeElement;
    const scale = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const context = canvas.getContext("2d");
    if (context) {
      context.scale(scale, scale); // Aplica a escala ao contexto do canvas
    }
  }

  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  save() {
    if (this.signaturePad) {
      const dataURL = this.signaturePad.toDataURL();
      console.log(dataURL); // Use a URL de dados como necessário
    }
  }
}
