import { Component, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MenuComponent } from "./components/menu/menu.component";
import { ChecksComponent } from "./components/checks/checks.component";
import { SignaturePadComponent } from "./components/signature-pad/signature-pad.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, MenuComponent, ChecksComponent, SignaturePadComponent, FormsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  obs_adc: string = "";

  configuracao = [
    { id: "check1", label: "EsistemLoja com certificado.", checked: false },
    { id: "check2", label: "EsistemLoja e Nfce com certificado.", checked: false },
    { id: "check3", label: "Esistem Nfce com CSC.", checked: false },
    { id: "check4", label: "Esistem Loja com gerencial.", checked: false },
    { id: "check5", label: "Movimentacoes e Venda Rapida", checked: false },
    { id: "check6", label: "Esistem Loja Financeiro.", checked: false },
    { id: "check7", label: "Instalado equipamento no local.", checked: false },
    { id: "check8", label: "Configurado equipamento na rede.", checked: false },
    { id: "check9", label: "Configurado IDCloud.", checked: false },
  ];
  treinamentoFiscal = [
    { id: "check10", label: "Cadastro de Cliente.", checked: false },
    { id: "check11", label: "Cadastro de Produto com perfil e CEST.", checked: false },
    { id: "check12", label: "Baixar e Importar XMLs.", checked: false },
    { id: "check13", label: "Inclusão de Fator de Conversão.", checked: false },
    { id: "check14", label: "Emissão de NFe.", checked: false },
    { id: "check15", label: "Emissão de NFCe e transmitir Off-line.", checked: false },
    { id: "check16", label: "Importação de DAV para NFe ou NFCe.", checked: false },
    { id: "check17", label: "Retirar Relatórios.", checked: false },
  ];

  treinamentoGerencial = [
    { id: "check18", label: "Cadastro de Cliente.", checked: false },
    { id: "check19", label: "Cadastro de Produto manual.", checked: false },
    { id: "check20", label: "Inclusão de movimentação de estoque.", checked: false },
    { id: "check21", label: "Inclusão de movimentação de venda rápida.", checked: false },
    { id: "check22", label: "Gerenciamento e fluxo de caixa.", checked: false },
    { id: "check23", label: "Gerenciar Títulos a Receber.", checked: false },
    { id: "check24", label: "Gerenciar Títulos a Pagar.", checked: false },
  ];

  treinamentoRHID = [
    { id: "check25", label: "Cadastro de Horários.", checked: false },
    { id: "check26", label: "Cadastro de Horários de Escala.", checked: false },
    { id: "check27", label: "Cadastro de Funcionários.", checked: false },
    { id: "check28", label: "Cadastro de Biometria.", checked: false },
    { id: "check29", label: "Verificação e apuração de Ponto.", checked: false },
    { id: "check30", label: "Retirada de relatórios de Ponto.", checked: false },
    { id: "check31", label: "Troca de bobina.", checked: false },
  ];

  listaConfig: string[] = [];
  listaTreinamento: string[] = [];

  verificarCheck(): Boolean {
    return (
      this.configuracao.some((i) => i.checked) ||
      this.treinamentoFiscal.some((i) => i.checked) ||
      this.treinamentoRHID.some((i) => i.checked)
    );
  }

  atualizarSelecao(itemSelecionado: string[]) {
    this.listaConfig = itemSelecionado;
  }

  atualizarTreinamento(itemSelecionado: string[]) {
    this.listaTreinamento = itemSelecionado;
  }

  ccopyToClipboard() {
    const configuracaoText = this.configuracao
      .filter((item) => item.checked)
      .map((item) => `• ${item.label}`)
      .join("\n");

    const treinamentoText = this.treinamentoFiscal
      .filter((item) => item.checked)
      .map((item) => `• ${item.label}`)
      .join("\n");

    const combinedText = `
  Configurações Executadas:
  ${configuracaoText}
  
  Treinamento Repassado:
  ${treinamentoText}

  Observações Adicionais:
  ${this.obs_adc}

    `.trim();

    // Copie o texto para o clipboard
    navigator.clipboard.writeText(combinedText).then(
      () => alert("Texto copiado!"),
      (err) => console.error("Erro ao copiar texto: ", err)
    );
  }
}
