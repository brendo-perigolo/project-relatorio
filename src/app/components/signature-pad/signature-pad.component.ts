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
    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 0.1,
      maxWidth: 1,
      penColor: "black",
      backgroundColor: "white",
    });
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
