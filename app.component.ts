import { Component, ComponentFactoryResolver, Inject, inject, Output } from "@angular/core";
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
import { Time } from "@angular/common";

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

  //MOSTRAR VERSAO

  showVersao = false;

  //MOSTRAR LISTA

  showLista = true;

  showPageLista() {
    this.showLista = true;
    this.showRelatorio = false;
  }

  // FINALIZAR

  finalizar = false;

  showFinalizar() {
    this.finalizar = true;
  }

  // VISUALIZAR Relatorio

  showRelatorio = false;

  //VISUALIZAR assinatura

  showAssinatura = false;
  showBtnAssinatura = false;

  verificarPosicao() {
    const question = window.confirm("A posição da assinatura está correta?");
    if (question) {
      this.padRotacao(); // Executa a ação se o usuário confirmar
    } else {
      alert("Por favor, vire a posição para vertical."); // Mensagem clara para instruir o usuário
    }
  }

  padRotacao() {
    this.showPadAssinatura();
  }

  showPadAssinatura() {
    this.showAssinatura = !this.showAssinatura;
    this.showRelatorio = false;
    this.showBtnAssinatura = false;
    this.finalizar = false;
  }

  // NAVEGAR PAGINA DE RELATORIO

  relatorio() {
    this.showRelatorio = true;
    this.showLista = false;
  }

  // PDF
  arquivoSelecionado: File | null = null;

  onFileSelected(event: any) {
    this.arquivoSelecionado = event.target.files[0];
    this.fileName = this.arquivoSelecionado?.name;
  }

  fileName: any = "";
  responsavel: string = "";
  entrada: string = "";

  async processarPdf() {
    if (!this.arquivoSelecionado) {
      alert("Selecione um arquivo");
      return;
    }

    try {
      const documentoPdf = await this.pdfService.importPdf(this.arquivoSelecionado);
      const textoCombinado = this.gerarTextoCombinado();
      this.pdfService.setResponsavel(this.responsavel);
      this.pdfService.setTimeEntrada(this.entrada);
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
    a.download = `${this.fileName}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  voltarTelaInicial() {
    this.showPageLista();
    this.showAssinatura = false;
  }

  ocultarPad() {
    this.showAssinatura = false;
    this.finalizar = true;
  }
}
