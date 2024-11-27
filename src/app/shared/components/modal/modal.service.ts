import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title: string;
  subtitle: string;
  image: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = signal<{
    isVisible: boolean;
    config: ModalConfig | null;
  }>({
    isVisible: false,
    config: null,
  });

  private timeoutId?: number;

  get isVisible() {
    return this.modalState().isVisible;
  }

  get config() {
    return this.modalState().config;
  }

  show(config: ModalConfig) {
    // Limpiar el timeout anterior si existe
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Mostrar el modal con la nueva configuración
    this.modalState.set({
      isVisible: true,
      config,
    });

    // Si se especifica duration, configurar el cierre automático
    if (config.duration) {
      this.timeoutId = window.setTimeout(() => {
        this.hide();
      }, config.duration);
    }
  }

  hide() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.modalState.set({
      isVisible: false,
      config: null,
    });
  }

  // Métodos de utilidad para casos comunes
  showError(message: string, duration: number = 5000) {
    this.show({
      title: 'Error',
      subtitle: message,
      image: 'assets/modal-error.png',
      duration,
    });
  }

  showSuccess(message: string, duration: number = 5000) {
    this.show({
      title: 'Éxito',
      subtitle: message,
      image: 'assets/modal-correcto.png',
      duration,
    });
  }
}

// src/app/shared/models/modal.types.ts
export interface ModalConfig {
  title: string;
  subtitle: string;
  image: string;
  duration?: number;
}
