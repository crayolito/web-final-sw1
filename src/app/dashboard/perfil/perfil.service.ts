import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { Comunicado, Servicio } from '../extra/extra.service';

export interface Regla {
  id: string;
  descripcion: string;
  categoria: string;
  color: string;
}

export interface Perfil {
  id: string;
  nombreParking: string;
  cantEspacios: number;
  horarioAtencion: string;
  correoElectronico: string;
  contrasena: string;
  telefono: string;
  direccion: string;
  coordenadas: string;
  urlGoogleMaps: string;
  imagenURL: string;
  reglas: Regla[];
  comunicados: Comunicado[];
  servicios: Servicio[];
}

interface ReglaCreateRequest {
  title: string;
  description: string;
  idParking: {
    id: string;
  };
}

interface ReglaUpdateResponse {
  id: string;
  title: string;
  description: string;
}

interface ParkingResponse {
  rules: {
    id: string;
    title: string;
    description: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  public http = inject(HttpClient);
  private apiUrl = 'https://parkingsw1-188f4effa11e.herokuapp.com/api';

  // Mock data for simulation
  private mockPerfiles: Perfil[] = [];

  constructor() {}

  // Update perfil
  updatePerfil(
    id: string,
    perfil: Partial<Perfil>
  ): Observable<Perfil | undefined> {
    const index = this.mockPerfiles.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockPerfiles[index] = { ...this.mockPerfiles[index], ...perfil };
      return of(this.mockPerfiles[index]).pipe(delay(500));
    }
    return of(undefined);
  }

  // Crear una Regla
  createRegla(
    title: string,
    description: string,
    parkingId: string
  ): Observable<Regla> {
    const request: ReglaCreateRequest = {
      title,
      description,
      idParking: {
        id: parkingId,
      },
    };

    return this.http
      .post<ReglaCreateRequest>(`${this.apiUrl}/rules`, request)
      .pipe(
        map((response: any) => ({
          id: response.id,
          categoria: response.title,
          descripcion: response.description,
          color: this.getColorByTitle(response.title),
        }))
      );
  }

  // Traer todas las reglas
  getReglas(parkingId: string): Observable<Regla[]> {
    return this.http
      .get<ParkingResponse>(`${this.apiUrl}/parkings/${parkingId}`)
      .pipe(
        map(
          (response) =>
            // Extraemos solo rules y mapeamos cada regla
            response.rules?.map((regla) => ({
              id: regla.id,
              categoria: regla.title,
              descripcion: regla.description,
              color: this.getColorByTitle(regla.title),
            })) || []
        )
      );
  }

  // Actualizar una regla
  updateRegla(id: string, regla: Partial<Regla>): Observable<Regla> {
    return this.http
      .patch<ReglaUpdateResponse>(`${this.apiUrl}/rules/${id}`, regla)
      .pipe(
        map((response) => {
          // Verificamos que tengamos los campos necesarios
          if (response.id && response.title && response.description) {
            return {
              id: response.id,
              categoria: response.title,
              descripcion: response.description,
              color: this.getColorByTitle(response.title),
            } as Regla;
          }
          throw new Error('Respuesta incompleta del servidor');
        })
      );
  }

  uploadToCloudinary(file: any): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'fqw7ooma');
    data.append('cloud_name', 'da9xsfose');
    return this.http.post(
      `https://api.cloudinary.com/v1_1/da9xsfose/image/upload`,
      data
    );
  }

  private getColorByTitle(title: string): string {
    switch (title.toLowerCase()) {
      case 'normas':
      case 'reglas de cumplimiento obligatorio':
        return '#FF6B6B';

      case 'cobertura':
      case 'responsabilidades del estacionamiento':
        return '#4ECDC4';

      case 'exclusiones':
      case 'limitaciones de responsabilidad':
        return '#95A5A6';

      default:
        return '#95A5A6'; // Color por defecto
    }
  }
}
