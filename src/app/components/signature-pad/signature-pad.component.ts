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

  showPad = true;

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
    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 0.5,
      maxWidth: 2.5,
      penColor: "black",
      backgroundColor: "white",
    });

    // Ajuste o tamanho do canvas
    this.setCanvasSize();
    this.drawBaseLine();
  }

  private setCanvasSize() {
    const canvas = this.signaturePadElement.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  private drawBaseLine() {
    const canvas = this.signaturePadElement.nativeElement;
    const context = canvas.getContext("2d");
    if (context) {
      // Ajuste o deslocamento da linha
      const lineOffset = 50; // Ajuste conforme necessário

      context.beginPath();
      context.moveTo(lineOffset, 0); // Linha começa no topo
      context.lineTo(lineOffset, canvas.height); // Linha vai até a parte inferior
      context.strokeStyle = "black"; // Cor da linha
      context.lineWidth = 0.5; // Espessura da linha
      context.stroke();
    }
  }

  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  save() {
    if (this.signaturePad) {
      this.signatureImage = this.signaturePad.toDataURL();
      console.log(this.signatureImage); // Faça o que for necessário com a imagem
    }
  }
}
