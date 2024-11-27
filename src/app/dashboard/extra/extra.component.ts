import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService } from '../../shared/components/modal/modal.service';
import { Comunicado, ExtraService, Servicio } from './extra.service';

@Component({
  selector: 'app-extra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './extra.component.html',
  styles: [
    `
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(155, 155, 155, 0.5);
        border-radius: 20px;
      }
    `,
  ],
})
export default class ExtraComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private extraService = inject(ExtraService);
  private modalService = inject(ModalService);
  private subscriptions: Subscription = new Subscription();

  public servicios: Servicio[] = [];
  public comunicados: Comunicado[] = [];
  public servicioEnEdicion: string | null = null;
  public comunicadoEnEdicion: string | null = null;

  public servicioForm: FormGroup = this.fb.group({
    nombre: [''],
    categoria: [''],
    precio: [''],
    descuento: [''],
  });

  public comunicadoForm: FormGroup = this.fb.group({
    contenido: [''],
    tipo: [''],
  });

  public categoriasServicio = [
    // Estacionamiento Auto
    'Estacionamiento Auto (15 min)',
    'Estacionamiento Auto (30 min)',
    'Estacionamiento Auto (1 hora)',
    'Estacionamiento Auto (4 horas)',
    'Estacionamiento Auto (12 horas)',
    'Estacionamiento Auto (Día completo)',
    'Estacionamiento Auto (Mensual)',

    // Estacionamiento Moto
    'Estacionamiento Moto (15 min)',
    'Estacionamiento Moto (30 min)',
    'Estacionamiento Moto (1 hora)',
    'Estacionamiento Moto (4 horas)',
    'Estacionamiento Moto (12 horas)',
    'Estacionamiento Moto (Día completo)',
    'Estacionamiento Moto (Mensual)',

    // Servicios de Limpieza
    'Lavado Básico Auto (30 min)',
    'Lavado Completo Auto (1 hora)',
    'Lavado Básico Moto (15 min)',
    'Lavado Completo Moto (30 min)',
    'Aspirado Express (15 min)',
    'Aspirado Profundo (30 min)',

    // Servicios Adicionales
    'Revisión de Niveles (15 min)',
    'Presión de Neumáticos (10 min)',
    'Carga Batería (30 min)',
    'Auxilio Mecánico Básico (30 min)',
  ];

  public tiposComunicado = [
    'Cierre Programado',
    'Cambio en el Servicio',
    'Alerta Importante',
  ];

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private cargarDatosIniciales(): void {
    const serviciosSub = this.extraService.getServicios().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.mostrarError('Error al cargar los servicios');
      },
    });

    const comunicadosSub = this.extraService.getComunicados().subscribe({
      next: (comunicados) => (this.comunicados = comunicados),
      error: (error) => {
        console.error('Error al cargar comunicados:', error);
        this.mostrarError('Error al cargar los comunicados');
      },
    });

    this.subscriptions.add(serviciosSub);
    this.subscriptions.add(comunicadosSub);
  }

  guardarServicio(): void {
    if (this.servicioForm.valid) {
      const servicioData = this.servicioForm.value;
      const sub = (
        this.servicioEnEdicion
          ? this.extraService.updateServicio(
              this.servicioEnEdicion,
              servicioData
            )
          : this.extraService.createServicio(servicioData)
      ).subscribe({
        next: (servicio) => {
          if (servicio) {
            this.obtenerServicios();
            this.servicioForm.reset();
            this.servicioEnEdicion = null;
            this.mostrarExito('Servicio guardado exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al guardar servicio:', error);
          this.mostrarError('Error al guardar el servicio');
        },
      });
      this.subscriptions.add(sub);
    }
  }

  editarServicio(index: number): void {
    const servicio = this.servicios[index];
    if (servicio) {
      this.servicioEnEdicion = servicio.id;
      this.servicioForm.patchValue(servicio);
    }
  }

  eliminarServicio(index: number): void {
    const servicio = this.servicios[index];
    if (servicio) {
      const sub = this.extraService.deleteServicio(servicio.id).subscribe({
        next: (success) => {
          if (success) {
            this.obtenerServicios();
            this.mostrarExito('Servicio eliminado exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al eliminar servicio:', error);
          this.mostrarError('Error al eliminar el servicio');
        },
      });
      this.subscriptions.add(sub);
    }
  }

  guardarComunicado(): void {
    if (this.comunicadoForm.valid) {
      const comunicadoData = this.comunicadoForm.value;
      const sub = (
        this.comunicadoEnEdicion
          ? this.extraService.updateComunicado(
              this.comunicadoEnEdicion,
              comunicadoData
            )
          : this.extraService.createComunicado(comunicadoData)
      ).subscribe({
        next: (comunicado) => {
          if (comunicado) {
            this.obtenerComunicados();
            this.comunicadoForm.reset();
            this.comunicadoEnEdicion = null;
            this.mostrarExito('Comunicado guardado exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al guardar comunicado:', error);
          this.mostrarError('Error al guardar el comunicado');
        },
      });
      this.subscriptions.add(sub);
    }
  }

  editarComunicado(index: number): void {
    const comunicado = this.comunicados[index];
    if (comunicado) {
      this.comunicadoEnEdicion = comunicado.id;
      this.comunicadoForm.patchValue(comunicado);
    }
  }

  eliminarComunicado(index: number): void {
    const comunicado = this.comunicados[index];
    if (comunicado) {
      const sub = this.extraService.deleteComunicado(comunicado.id).subscribe({
        next: (success) => {
          if (success) {
            this.obtenerComunicados();
            this.mostrarExito('Comunicado eliminado exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al eliminar comunicado:', error);
          this.mostrarError('Error al eliminar el comunicado');
        },
      });
      this.subscriptions.add(sub);
    }
  }

  private obtenerServicios(): void {
    const sub = this.extraService.getServicios().subscribe({
      next: (servicios) => (this.servicios = servicios),
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.mostrarError('Error al cargar los servicios');
      },
    });
    this.subscriptions.add(sub);
  }

  private obtenerComunicados(): void {
    const sub = this.extraService.getComunicados().subscribe({
      next: (comunicados) => (this.comunicados = comunicados),
      error: (error) => {
        console.error('Error al cargar comunicados:', error);
        this.mostrarError('Error al cargar los comunicados');
      },
    });
    this.subscriptions.add(sub);
  }

  private mostrarExito(mensaje: string): void {
    this.modalService.show({
      title: 'Éxito',
      subtitle: mensaje,
      image: 'assets/modal-correcto.png',
      duration: 3000,
    });
  }

  private mostrarError(mensaje: string): void {
    this.modalService.show({
      title: 'Error',
      subtitle: mensaje,
      image: 'assets/modal-error.png',
      duration: 3000,
    });
  }
}
