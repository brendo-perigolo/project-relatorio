import { isPlatformBrowser } from "@angular/common";
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

@Component({
  selector: "app-signature-pad",
  standalone: true,
  imports: [],
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
        this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
      } else {
        console.error("Elemento de assinatura não encontrado.");
      }
    }
  }

  clear() {
    this.signaturePad?.clear();
  }

  save() {
    if (this.signaturePad?.isEmpty()) {
      alert("Por favor, adicione uma assinatura.");
      return;
    }
    this.signatureImage = this.signaturePad.toDataURL("image/png");
    this.pdfService.setSignatureImage(this.signatureImage);
  }
}
