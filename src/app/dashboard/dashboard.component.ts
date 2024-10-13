import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface OptionDashboard {
  img: string;
  ruta: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export default class DashboardComponent {
  public route = inject(Router);
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
      ruta: 'dashboard/config',
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
  public estadoDashboard: OptionDashboard = this.options[0];

  public cambiarEstadoDashboard(estado: OptionDashboard): void {
    this.estadoDashboard = estado;
    this.route.navigate([estado.ruta]);
  }

  cerrarSesion(): void {
    this.route.navigate(['home']);
  }
}
