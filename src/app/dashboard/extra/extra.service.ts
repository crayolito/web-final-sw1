import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface Servicio {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  descuento: number;
}

export interface Comunicado {
  id: string;
  contenido: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExtraService {
  private mockServicios: Servicio[] = [];
  private mockComunicados: Comunicado[] = [];

  constructor() {}

  // Servicios CRUD
  createServicio(servicio: Omit<Servicio, 'id'>): Observable<Servicio> {
    const newServicio = {
      ...servicio,
      id: crypto.randomUUID(),
    };
    this.mockServicios.push(newServicio);
    return of(newServicio).pipe(delay(500));
  }

  getServicios(): Observable<Servicio[]> {
    return of(this.mockServicios).pipe(delay(500));
  }

  updateServicio(
    id: string,
    servicio: Partial<Servicio>
  ): Observable<Servicio | undefined> {
    const index = this.mockServicios.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.mockServicios[index] = { ...this.mockServicios[index], ...servicio };
      return of(this.mockServicios[index]).pipe(delay(500));
    }
    return of(undefined);
  }

  deleteServicio(id: string): Observable<boolean> {
    const index = this.mockServicios.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.mockServicios.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  // Comunicados CRUD
  createComunicado(comunicado: Omit<Comunicado, 'id'>): Observable<Comunicado> {
    const newComunicado = {
      ...comunicado,
      id: crypto.randomUUID(),
    };
    this.mockComunicados.push(newComunicado);
    return of(newComunicado).pipe(delay(500));
  }

  getComunicados(): Observable<Comunicado[]> {
    return of(this.mockComunicados).pipe(delay(500));
  }

  updateComunicado(
    id: string,
    comunicado: Partial<Comunicado>
  ): Observable<Comunicado | undefined> {
    const index = this.mockComunicados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.mockComunicados[index] = {
        ...this.mockComunicados[index],
        ...comunicado,
      };
      return of(this.mockComunicados[index]).pipe(delay(500));
    }
    return of(undefined);
  }

  deleteComunicado(id: string): Observable<boolean> {
    const index = this.mockComunicados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.mockComunicados.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }
}
