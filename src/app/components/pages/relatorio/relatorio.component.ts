import { Component } from "@angular/core";
import { SignaturePadComponent } from "../../signature-pad/signature-pad.component";

@Component({
  selector: "app-relatorio",
  standalone: true,
  imports: [SignaturePadComponent],
  templateUrl: "./relatorio.component.html",
  styleUrl: "./relatorio.component.scss",
})
export class RelatorioComponent {
  showPad = true;
  showPadBtn = true;
  btnPadText = "Assinatura";
  ngOnInit() {
    this.showPad = false;
  }

  showPadEvent() {
    this.showPad = !this.showPad;
    this.updateBtnPadText();
  }

  private updateBtnPadText() {
    if (this.showPad) {
      this.btnPadText = "Relatório";
    } else {
      this.btnPadText = "Assinatura";
    }
  }
}
