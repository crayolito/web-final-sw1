import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Comunicado, Servicio } from '../dashboard/extra/extra.service';
import { Regla } from '../dashboard/perfil/perfil.service';

export interface EmpresaInfo {
  idUsuario: string;
  idParking: string;
  email: string;
  name: string;
  photoUrl: string;
  cantidadEspacios: number;
  horarioAtencion: string;
  telefono: string;
  direccion: string;
  coordenadas: string;
  urlGoogleMaps: string;
  ofertas: Servicio[];
  comunicados: Comunicado[];
  reglas: Regla[];
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  public http = inject(HttpClient);
  private apiUrl = 'https://parkingsw1-188f4effa11e.herokuapp.com/api';
  public empresaInfo = signal<EmpresaInfo | null>(null);

  registrarEmpresaParking(
    name: string,
    email: string,
    password: string,
    rol: string,
    cellphone: string
  ): Observable<boolean> {
    const empresaData = {
      name,
      email,
      password,
      rol,
      cellphone,
      tokenFCM: '',
    };

    return this.http
      .post<any>(`${this.apiUrl}/auth/register`, empresaData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((response) => {
          console.log(response);
          // Verifica que existan todos los campos requeridos
          const isValid = !!(
            response &&
            response.email &&
            response.name &&
            response.cellphone &&
            response.rol
          );
          return isValid; // Retorna true solo si todos los campos existen
        }),
        tap((success) => {
          console.log(success ? 'Registro exitoso' : 'Registro incompleto');
        }),
        catchError((error) => {
          console.log('Error al registrar empresa', error);
          return of(false); // Retorna false en caso de error
        })
      );
  }

  iniciarSesion(email: string, password: string): Observable<EmpresaInfo> {
    const loginData = {
      email,
      password,
    };

    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, loginData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((response) => {
          console.log('Respuesta del backend:', response);
          return {
            idUsuario: response.id,
            idParking: response.parking.id,
            email: response.email,
            name: response.parking.name,
            photoUrl: response.parking.photoUrl || '', // Valor por defecto si es null
            cantidadEspacios: response.parking.numberOfSpaces || 0,
            horarioAtencion: response.parking.openingHours || '',
            telefono: response.parking.cellphone || '',
            direccion: response.parking.direction || '',
            coordenadas: response.parking.coordinates || '',
            urlGoogleMaps: response.parking.urlGoogleMaps || '',
            ofertas:
              response.parking.offers?.map((oferta: any) => ({
                id: oferta.id,
                categoria: oferta.title,
                nombre: oferta.description,
                precio: oferta.price,
                descuento: oferta.discount,
              })) || [],
            comunicados:
              response.parking.announcements?.map((comunicado: any) => ({
                id: comunicado.id,
                tipo: comunicado.title,
                contenido: comunicado.description,
              })) || [],
            reglas:
              response.parking.rules?.map((regla: any) => ({
                id: regla.id,
                categoria: regla.title,
                descripcion: regla.description,
                color: this.getColorByTitle(regla.title),
              })) || [],
          } as EmpresaInfo;
        }),
        tap((empresaInfo) => console.log('Login exitoso:', empresaInfo)),
        catchError((error) => {
          console.error('Error al iniciar sesión', error);
          throw error; // Mejor lanzar el error que retornar false
        })
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
