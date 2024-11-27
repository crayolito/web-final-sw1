import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  public http = inject(HttpClient);
  private apiUrl = 'api/perfil';

  // Mock data for simulation
  private mockPerfiles: Perfil[] = [];
  private mockReglas: Regla[] = [];

  constructor() {}

  // Create new perfil
  createPerfil(perfil: Omit<Perfil, 'id'>): Observable<Perfil> {
    const newPerfil = {
      ...perfil,
      id: crypto.randomUUID(),
    };
    this.mockPerfiles.push(newPerfil);
    return of(newPerfil).pipe(delay(500)); // Simulate network delay
  }

  // Get all perfiles
  getPerfiles(): Observable<Perfil[]> {
    return of(this.mockPerfiles).pipe(delay(500));
  }

  // Get perfil by ID
  getPerfilById(id: string): Observable<Perfil | undefined> {
    const perfil = this.mockPerfiles.find((p) => p.id === id);
    return of(perfil).pipe(delay(500));
  }

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

  // Delete perfil
  deletePerfil(id: string): Observable<boolean> {
    const index = this.mockPerfiles.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockPerfiles.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  // Create new regla
  createRegla(regla: Omit<Regla, 'id'>): Observable<Regla> {
    const newRegla = {
      ...regla,
      id: crypto.randomUUID(),
    };
    this.mockReglas.push(newRegla);
    return of(newRegla).pipe(delay(500));
  }

  // Get all reglas
  getReglas(): Observable<Regla[]> {
    return of(this.mockReglas).pipe(delay(500));
  }

  // Get regla by ID
  getReglaById(id: string): Observable<Regla | undefined> {
    const regla = this.mockReglas.find((r) => r.id === id);
    return of(regla).pipe(delay(500));
  }

  // Update regla
  updateRegla(
    id: string,
    regla: Partial<Regla>
  ): Observable<Regla | undefined> {
    const index = this.mockReglas.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.mockReglas[index] = { ...this.mockReglas[index], ...regla };
      return of(this.mockReglas[index]).pipe(delay(500));
    }
    return of(undefined);
  }

  // Delete regla
  deleteRegla(id: string): Observable<boolean> {
    const index = this.mockReglas.findIndex((r) => r.id == id);
    if (index !== -1) {
      this.mockReglas.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false);
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
}
