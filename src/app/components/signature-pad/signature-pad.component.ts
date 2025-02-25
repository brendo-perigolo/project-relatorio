import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  output,
  Output,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import SignaturePad from "signature_pad";
import { PdfServiceService } from "../../services/pdf-service.service";
import { ReactiveFormsModule } from "@angular/forms";

import getStroke from "perfect-freehand";
import { emit } from "process";

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
  signatureData: any[] = [];
  assinaturaLocalStorage = true;

  private pdfService = inject(PdfServiceService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.verificaAssinaturaLocalStorage();
  }

  verificaAssinaturaLocalStorage() {
    const assinatura = localStorage.getItem("key");

    if (assinatura === null) {
      this.assinaturaLocalStorage = false;
    }
  }

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
      this.pdfService.setSignatureImage(dataURL);
      this.ocutarAssinatura();
    }
  }

  saveTecnico() {
    if (this.signaturePad) {
      const dataUrl = this.signaturePad.toDataURL();
      localStorage.setItem("key", dataUrl);
      alert("Assinatura Tecnico Salva!");
    }
  }

  @Output() voltarPrincipal = new EventEmitter();
  @Output() ocutarPad = new EventEmitter();
  voltar() {
    this.voltarPrincipal.emit();
  }

  ocutarAssinatura() {
    this.ocutarPad.emit();
  }
}
