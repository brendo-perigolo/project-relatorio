import { Component } from "@angular/core";
import { SignaturePadComponent } from "../../signature-pad/signature-pad.component";

@Component({
  selector: "app-relatorio",
  standalone: true,
  imports: [SignaturePadComponent],
  templateUrl: "./relatorio.component.html",
  styleUrl: "./relatorio.component.scss",
})
export class RelatorioComponent {}
