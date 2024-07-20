import { CommonModule } from "@angular/common";
import { Component, Input, Output, OnChanges, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-checks",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./checks.component.html",
  styleUrl: "./checks.component.scss",
})
export class ChecksComponent {
  @Input() items: { id: string; label: string; checked: boolean }[] = [];
  @Output() selectionChanged = new EventEmitter<any>();

  ngOnChanges() {
    this.emitSelectedItems();
  }

  onCheckboxChange() {
    this.emitSelectedItems();
  }

  private emitSelectedItems() {
    const selectedItems = this.items.filter((item) => item.checked).map((item) => item.label);
    this.selectionChanged.emit(selectedItems);
  }
}
