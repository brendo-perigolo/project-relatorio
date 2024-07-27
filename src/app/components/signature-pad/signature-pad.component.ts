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
        this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
        this.drawBaseLine();
      } else {
        console.error("Elemento de assinatura não encontrado.");
      }
    }
  }

  clear() {
    this.signaturePad?.clear();
    this.showPad = true;
  }

  save() {
    if (this.signaturePad?.isEmpty()) {
      alert("Por favor, adicione uma assinatura.");
      return;
    }
    this.signatureImage = this.signaturePad.toDataURL("image/png");
    this.pdfService.setSignatureImage(this.signatureImage);
    this.showPad = false;
  }

  private drawBaseLine() {
    const canvas = this.signaturePadElement.nativeElement;
    const context = canvas.getContext("2d");
    const lineOffset = 50; // Ajuste este valor conforme necessário

    context.beginPath();
    context.moveTo(lineOffset, 3); // Início da linha (no deslocamento do topo esquerdo)
    context.lineTo(lineOffset, canvas.height); // Fim da linha (no deslocamento da parte inferior esquerda)
    context.strokeStyle = "black"; // Cor da linha
    context.lineWidth = 1; // Espessura da linha
    context.stroke();
  }
}
