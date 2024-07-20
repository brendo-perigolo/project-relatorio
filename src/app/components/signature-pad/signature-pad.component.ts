import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import SignaturePad from "signature_pad";

@Component({
  selector: "app-signature-pad",
  standalone: true,
  imports: [],
  templateUrl: "./signature-pad.component.html",
  styleUrl: "./signature-pad.component.scss",
})
export class SignaturePadComponent {
  @ViewChild("signatureCanvas", { static: true }) signatureCanvas!: ElementRef;
  signaturePad!: SignaturePad;

  signatureImage: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
        minWidth: 2,
        maxWidth: 5,
        backgroundColor: "rgba(255, 255, 255, 0)",
        penColor: "rgb(0, 0, 0)",
      });
    }
  }

  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.signatureImage = null;
    }
  }

  save() {
    if (this.signaturePad) {
      this.signatureImage = this.signaturePad.toDataURL("image/png");
    }
  }

  getSignatureImage() {
    return this.signaturePad.toDataURL();
  }
}
