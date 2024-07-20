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
  styleUrls: ["./app.component.scss"], // Corrigido para 'styleUrls'
})
export class AppComponent {
  obs_adc: string = ""; // Propriedade para o campo de texto

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
    { id: "check11", label: "Cadastro de Produto com perfil e Cest.", checked: false },
    { id: "check12", label: "Baixar e Importar Xml`s.", checked: false },
    { id: "check13", label: "Inclusao de Fator de Conversao e Preço.", checked: false },
    { id: "check14", label: "Emissao de Nfe.", checked: false },
    { id: "check15", label: "Emissao de Nfce e transmitir Off-line.", checked: false },
    { id: "check16", label: "Retirar Relatorios", checked: false },
  ];

  treinamentoGerencial = [];

  treinamentoRHID = [
    { id: "check17", label: "Cadastro de Horarios.", checked: false },
    { id: "check18", label: "Cadastro de Horarios Escala.", checked: false },
    { id: "check19", label: "Cadastro de Funcionarios.", checked: false },
    { id: "check20", label: "Cadastro de Biometria.", checked: false },
    { id: "check21", label: "Verificacao e apuracao de Ponto.", checked: false },
    { id: "check22", label: "Retirada de relatorios de Ponto.", checked: false },
    { id: "check23", label: "Troca de bobina.", checked: false },
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

  copyToClipboard() {
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
      () => alert("Texto copiado para o clipboard!"),
      (err) => console.error("Erro ao copiar texto: ", err)
    );
  }
}
