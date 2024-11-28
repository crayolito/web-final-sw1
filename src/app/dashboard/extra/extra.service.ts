import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

export interface Servicio {
  id: string;
  nombre: string; // se mapea a description en la API
  categoria: string; // se mapea a title en la API
  precio: number; // se mapea a price
  descuento: number; // se mapea a discount
}

export interface Comunicado {
  id: string;
  contenido: string; // se mapea a description en la API
  tipo: string; // se mapea a title en la API
}

interface ServicioCreateRequest {
  title: string; // categoria
  description: string; // nombre
  price: number;
  discount: number;
  time: string;
  idParking: string;
}

interface ComunicadoCreateRequest {
  title: string; // tipo
  description: string; // contenido
  idParking: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExtraService {
  private http = inject(HttpClient);
  private apiUrl = 'https://parkingsw1-188f4effa11e.herokuapp.com/api';

  // Servicios CRUD
  createServicio(
    servicio: Omit<Servicio, 'id'>,
    parkingId: string
  ): Observable<Servicio[]> {
    const request: ServicioCreateRequest = {
      title: servicio.categoria,
      description: servicio.nombre,
      price: servicio.precio,
      discount: servicio.descuento,
      time: new Date().toISOString().split('T')[0],
      idParking: parkingId,
    };

    return this.http
      .post<any>(`${this.apiUrl}/offers`, request)
      .pipe(switchMap(() => this.getServicios(parkingId)));
  }

  updateServicio(
    id: string,
    servicio: Partial<Servicio>,
    parkingId: string
  ): Observable<Servicio[]> {
    const request = {
      ...(servicio.categoria && { title: servicio.categoria }),
      ...(servicio.nombre && { description: servicio.nombre }),
      ...(servicio.precio && { price: servicio.precio }),
      ...(servicio.descuento && { discount: servicio.descuento }),
    };

    return this.http
      .patch<any>(`${this.apiUrl}/offers/${id}`, request)
      .pipe(switchMap(() => this.getServicios(parkingId)));
  }

  getServicios(parkingId: string): Observable<Servicio[]> {
    return this.http.get<any>(`${this.apiUrl}/parkings/${parkingId}`).pipe(
      map((response) => {
        if (response.offers) {
          return response.offers.map((offer: any) => ({
            id: offer.id,
            nombre: offer.description,
            categoria: offer.title,
            precio: offer.price,
            descuento: offer.discount,
          }));
        }
        return [];
      })
    );
  }

  // Comunicados CRUD
  createComunicado(
    comunicado: Omit<Comunicado, 'id'>,
    parkingId: string
  ): Observable<Comunicado[]> {
    const request: ComunicadoCreateRequest = {
      title: comunicado.tipo,
      description: comunicado.contenido,
      idParking: parkingId,
    };

    return this.http
      .post<any>(`${this.apiUrl}/announcements`, request)
      .pipe(switchMap(() => this.getComunicados(parkingId)));
  }

  updateComunicado(
    id: string,
    comunicado: Partial<Comunicado>,
    parkingId: string
  ): Observable<Comunicado[]> {
    const request = {
      ...(comunicado.tipo && { title: comunicado.tipo }),
      ...(comunicado.contenido && { description: comunicado.contenido }),
    };

    return this.http
      .patch<any>(`${this.apiUrl}/announcements/${id}`, request)
      .pipe(switchMap(() => this.getComunicados(parkingId)));
  }

  getComunicados(parkingId: string): Observable<Comunicado[]> {
    return this.http.get<any>(`${this.apiUrl}/parkings/${parkingId}`).pipe(
      map((response) => {
        if (response.announcements) {
          return response.announcements.map((announcement: any) => ({
            id: announcement.id,
            contenido: announcement.description,
            tipo: announcement.title,
          }));
        }
        return [];
      })
    );
  }
}
