import { CommonModule } from "@angular/common";
import { HtmlParser } from "@angular/compiler";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.scss",
})
export class MenuComponent {
  @Input() panelId: string = "";
  @Input() linkText: string = "";
}
