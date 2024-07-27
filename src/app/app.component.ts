import { Component, ComponentFactoryResolver, Inject, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { MenuComponent } from "./components/menu/menu.component";
import { ChecksComponent } from "./components/checks/checks.component";
import { SignaturePadComponent } from "./components/signature-pad/signature-pad.component";
import { FormsModule } from "@angular/forms";
import {
  configuracao,
  treinamentoCheff,
  treinamentoFiscal,
  treinamentoGerencial,
  treinamentoRHID,
} from "./Data/configData";
import { PdfServiceService } from "./services/pdf-service.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, MenuComponent, ChecksComponent, SignaturePadComponent, FormsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  private pdfService = inject(PdfServiceService);
  private router = inject(Router);

  constructor(private resolver: ComponentFactoryResolver) {}

  obs_adc: string = "";
  listaConfig: string[] = [];
  listaTreinamento: string[] = [];
  signatureIamge: string | null = null;

  //MOSTRAR LISTA

  showLista = true;

  // VISUALIZAR Relatorio

  showRelatorio = false;

  // NAVEGAR PAGINA DE RELATORIO
  relatorioPage() {
    this.showRelatorio = true;
    this.showLista = false;
    this.navegarAssintatura();
  }

  // PDF
  arquivoSelecionado: File | null = null;

  onFileSelected(event: any) {
    this.arquivoSelecionado = event.target.files[0];
  }

  async processarPdf() {
    if (!this.arquivoSelecionado) {
      alert("Selecione um arquivo");
      return;
    }

    try {
      const documentoPdf = await this.pdfService.importPdf(this.arquivoSelecionado);
      const textoCombinado = this.gerarTextoCombinado();
      const pdfEditado = await this.pdfService.editPdf(documentoPdf, textoCombinado);
      const pdfBlob = await this.pdfService.generatePdf(pdfEditado);
      this.downloadPdf(pdfBlob);
    } catch (error) {
      console.error("Erro ao processar o PDF:", error);
    }
  }

  //CATEGORIAS

  configuracao = configuracao;
  treinamentoFiscal = treinamentoFiscal;
  treinamentoGerencial = treinamentoGerencial;
  treinamentoRHID = treinamentoRHID;
  treinamentoCheff = treinamentoCheff;

  // VERIFICAR CHECK ATIVOS

  verificarCheck(): Boolean {
    return (
      this.configuracao.some((i) => i.checked) ||
      this.treinamentoFiscal.some((i) => i.checked) ||
      this.treinamentoGerencial.some((i) => i.checked) ||
      this.treinamentoRHID.some((i) => i.checked) ||
      this.treinamentoCheff.some((i) => i.checked)
    );
  }

  // ATUALIZAR LISTA COM CHECKS ATUALIZADOS -- STRING DE CONFIG

  atualizarSelecao(itemSelecionado: string[]) {
    this.listaConfig = itemSelecionado;
  }

  // ATUALIZA LISTA DE CHECK ATUALIZADOS -- STRING DE TREINAMENTO

  atualizarTreinamento(itemSelecionado: string[]) {
    this.listaTreinamento = itemSelecionado;
  }

  gerarTextoCombinado() {
    let textoFinal = "";

    const configuracaoText = this.configuracao
      .filter((item) => item.checked)
      .map((item) => `• ${item.label}`)
      .join("\n");

    if (configuracaoText) {
      textoFinal += `Instalações e Configurações:\n${configuracaoText}\n\n`;
    }

    const treinamentoFiscalText = this.treinamentoFiscal
      .filter((item) => item.checked)
      .map((item) => `• ${item.label}`)
      .join("\n");

    if (treinamentoFiscalText) {
      textoFinal += `Treinamento Fiscal:\n${treinamentoFiscalText}\n\n`;
    }

    const treinamentoGerencialText = this.treinamentoGerencial
      .filter((item) => item.checked)
      .map((item) => `• ${item.label}`)
      .join("\n");

    if (treinamentoGerencialText) {
      textoFinal += `Treinamento Gerencial:\n${treinamentoGerencialText}\n\n`;
    }

    const treinamentoRHIDText = this.treinamentoRHID
      .filter((item) => item.checked)
      .map((item) => `• ${item.label}`)
      .join("\n");

    if (treinamentoRHIDText) {
      textoFinal += `Treinamento Ponto:\n${treinamentoRHIDText}\n\n`;
    }

    const treinamentoCheffText = this.treinamentoCheff
      .filter((item) => item.checked)
      .map((item) => `• ${item.label}`)
      .join("\n");

    if (treinamentoCheffText) {
      textoFinal += `Treinamento Cheff:\n${treinamentoCheffText}\n\n`;
    }

    if (this.obs_adc.length > 0) {
      textoFinal += `Observações Adicionais:\n${this.obs_adc}\n\n`;
    }

    return textoFinal.trim();
  }

  downloadPdf(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  navegarAssintatura() {
    this.router.navigate(["/complete"]);
  }
}
