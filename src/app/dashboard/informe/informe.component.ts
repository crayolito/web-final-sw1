import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { ModalService } from '../../shared/components/modal/modal.service';
import { InformeService, Ticket } from './informe.service';

@Component({
  selector: 'app-informe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './informe.component.html',
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
export default class InformeComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private informeService = inject(InformeService);
  private homeService = inject(HomeService);
  private modalService = inject(ModalService);
  private subscriptions: Subscription = new Subscription();

  public tickets: Ticket[] = [];
  private parkingId: string = '';

  public searchForm: FormGroup = this.fb.group({
    searchDate: [''],
  });

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private cargarDatosIniciales(): void {
    let info = this.homeService.empresaInfo();

    if (info) {
      this.inicializarDatos(info);
    } else {
      const storedData = localStorage.getItem('empresaInfo');
      if (storedData) {
        try {
          info = JSON.parse(storedData);
          this.inicializarDatos(info);
        } catch (error) {
          console.error('Error al parsear datos del localStorage:', error);
          this.mostrarError(
            'No se encontraron datos pre almacenados de la empresa'
          );
        }
      } else {
        this.mostrarError('No se encontraron datos de la empresa');
      }
    }
  }

  private inicializarDatos(info: any): void {
    this.parkingId = info.idParking;

    if (this.parkingId) {
      this.obtenerTickets();
    }
  }

  private obtenerTickets(): void {
    const sub = this.informeService.getTickets(this.parkingId).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
      },
      error: (error) => {
        console.error('Error al cargar tickets:', error);
        this.mostrarError('Error al cargar los tickets');
      },
    });
    this.subscriptions.add(sub);
  }

  getStateClass(state: string): string {
    switch (state.toLowerCase()) {
      case 'pagado':
        return 'bg-custom-quinary/65';
      case 'pendiente':
        return 'bg-custom-quaternary/65';
      case 'cancelado':
        return 'bg-custom-tertiary/65';
      default:
        return 'bg-custom-quaternary/65';
    }
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
