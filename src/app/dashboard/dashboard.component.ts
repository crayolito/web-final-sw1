import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HomeService } from '../home/home.service';
import { ModalComponent } from '../shared/components/modal/modal.component';

interface OptionDashboard {
  img: string;
  ruta: string;
}
interface PlanOption {
  id: number;
  tiempo: string;
  precio: number;
  imagen: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export default class DashboardComponent {
  public route = inject(Router);
  public homeService = inject(HomeService);
  showModal = false;
  selectedPlan: PlanOption | null = null;
  public options: OptionDashboard[] = [
    {
      img: 'assets/opcion-perfil.svg',
      ruta: 'dashboard/perfil',
    },
    {
      img: 'assets/opcion-settings.svg',
      ruta: 'dashboard/informe',
    },
    {
      img: 'assets/opcion-config.svg',
      ruta: 'dashboard/extra',
    },
    {
      img: 'assets/opcion-calendario.svg',
      ruta: 'dashboard/calendario',
    },
    {
      img: 'assets/option-maps.svg',
      ruta: 'dashboard/map',
    },
  ];
  planes: PlanOption[] = [
    {
      id: 1,
      tiempo: '3 MESES ',
      precio: 300,
      imagen: 'assets/primerS-standard.png',
    },
    {
      id: 2,
      tiempo: '6 MESES',
      precio: 650,
      imagen: 'assets/primerP-6.png',
    },
    {
      id: 3,
      tiempo: '12 meses',
      precio: 1300,
      imagen: 'assets/primerT-online-store.png',
    },
  ];

  public estadoDashboard: OptionDashboard = this.options[0];

  public cambiarEstadoDashboard(estado: OptionDashboard): void {
    this.estadoDashboard = estado;
    this.route.navigate([estado.ruta]);
  }

  cerrarSesion(): void {
    // Limpiar el estado del servicio
    this.homeService.empresaInfo.set(null);

    // Limpiar localStorage
    localStorage.removeItem('empresaInfo');

    // Redirigir a home
    this.route.navigate(['home']);
  }

  openModal() {
    console.log('Button clicked');
    this.showModal = true;
    console.log('showModal is now:', this.showModal);
  }
  onPlanSelect(event: any) {
    const planId = parseInt(event.target.value);
    this.selectedPlan = this.planes.find((plan) => plan.id === planId) || null;
  }

  confirmarPlan() {
    if (this.selectedPlan) {
      console.log('Plan seleccionado:', this.selectedPlan);
      this.showModal = false;
    }
  }
}
