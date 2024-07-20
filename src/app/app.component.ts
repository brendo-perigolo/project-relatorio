import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MenuComponent } from "./components/menu/menu.component";
import { ChecksComponent } from "./components/checks/checks.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, MenuComponent, ChecksComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  configuracao = [
    { id: "check1", label: "EsistemLoja com certificado.", checked: false },
    { id: "check2", label: "EsistemLoja e Nfce com certificado.", checked: false },
    { id: "check3", label: "Esistem Nfce com CSC.", checked: false },
    { id: "check3", label: "Esistem Loja com gerencial.", checked: false },
    { id: "check3", label: "Movimentacoes e Venda Rapida", checked: false },
    { id: "check3", label: "Esistem Loja Financeiro.", checked: false },
    { id: "check3", label: "Instalado equipamento no local.", checked: false },
    { id: "check3", label: "Configurado equipamento na rede.", checked: false },
    { id: "check3", label: "Configurado IDCloud.", checked: false },
  ];

  treinamentoFiscal = [
    { id: "check4", label: "Cadastro de Cliente.", checked: false },
    { id: "check1", label: "Cadastro de Produto com perfil e Cest.", checked: false },
    { id: "check1", label: "Baixar e Importar Xml`s.", checked: false },
    { id: "check1", label: "Inclusao de Fator de Conversao e Preço.", checked: false },
    { id: "check1", label: "Emissao de Nfe.", checked: false },
    { id: "check1", label: "Emissao de Nfce e transmitir Off-line.", checked: false },
    { id: "check1", label: "Retirar Relatorios", checked: false },
  ];

  treinamentoGerencial = [];

  treinamentoRHID = [
    { id: "check4", label: "Cadastro de Horarios.", checked: false },
    { id: "check4", label: "Cadastro de Horarios Escala.", checked: false },
    { id: "check4", label: "Cadastro de Funcionarios.", checked: false },
    { id: "check4", label: "Cadastro de Biometria.", checked: false },
    { id: "check4", label: "Verificacao e apuracao de Ponto.", checked: false },
    { id: "check4", label: "Retirada de relatorios de Ponto.", checked: false },
    { id: "check4", label: "Troca de bobina.", checked: false },
  ];

  listaConfig: string[] = [];
  listaTreinamento: string[] = [];

  atualizarSelecao(itemSelecionado: string[]) {
    this.listaConfig = itemSelecionado;
  }
  atualizarTreinamento(itemSelecionado: string[]) {
    this.listaTreinamento = itemSelecionado;
  }

  get textoParaCopiar(): string {
    return `
      Configurações Executadas:
      ${this.listaConfig.join("\n")}

      Treinamento Repassado:
      ${this.listaTreinamento.join("\n")}
    `;
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

    // Cria o texto combinado com formatação adequada
    const combinedText = `Configurações Executadas:\n${configuracaoText}\n\nTreinamento Repassado:\n${treinamentoText}`;

    navigator.clipboard.writeText(combinedText).then(
      () => alert("Texto copiado"),
      (err) => console.error("Erro ao copiar texto: ", err)
    );
  }
}
