// modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="modalService.isVisible"
      (click)="handleBackgroundClick($event)"
      class="fixed inset-0 h-full w-full flex items-center justify-center bg-black/75 backdrop-blur-sm z-50"
    >
      <div
        class="bg-custom-secondary rounded-xl shadow-2xl border border-custom-primary/20 w-[90%] max-w-md transform transition-all"
      >
        <!-- Header -->
        <div class="p-6 border-b border-custom-primary/20">
          <div class="flex items-center justify-center w-full">
            <h3
              class="text-2xl font-bold font-maven-pro text-custom-primary text-center w-full"
            >
              {{ modalService.config?.title }}
            </h3>
          </div>
        </div>
        <!-- Body -->
        <div class="p-6">
          <div class="flex flex-col items-center space-y-6">
            <img
              [src]="modalService.config?.image"
              [alt]="modalService.config?.title"
              class="h-32 w-32 object-contain"
            />
            <p
              class="text-custom-primary/80 text-lg text-center font-maven-pro"
            >
              {{ modalService.config?.subtitle }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  public modalService = inject(ModalService);

  handleBackgroundClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.modalService.hide();
    }
  }
}
