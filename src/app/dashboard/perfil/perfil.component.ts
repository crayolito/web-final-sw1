import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { EmpresaInfo, HomeService } from '../../home/home.service';
import { ModalService } from '../../shared/components/modal/modal.service';
import { Perfil, PerfilService, Regla } from './perfil.service';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2N1bXBpaSIsImEiOiJjbHhsbjFycm8wMjBoMmpwd3NvenpnMmgxIn0.sO-6U8_MXbVYmwWquibutA';

interface Categoria {
  display: string;
  value: string;
  color: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
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
export default class PerfilComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('map') divMap!: ElementRef;
  public map?: Map;
  public marker?: Marker;

  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilService);
  private homeService = inject(HomeService);
  public modalService = inject(ModalService);
  private subscriptions: Subscription = new Subscription();

  public imageEmpresa = signal<string>('assets/subir-imagen.png');
  public estadoImagen = signal<boolean>(false);
  public estadoForm = signal<boolean>(false);

  public perfilActual: Perfil | null = null;
  public reglas: Regla[] = [];
  public reglaEnEdicion: string | null = null;
  private parkingId: string = ''; // Añadido para almacenar el ID del parking

  public perfilForm: FormGroup = this.fb.group({
    nombreParking: [''],
    cantEspacios: [''],
    horarioAtencion: [''],
    correoElectronico: [''],
    contrasena: [''],
    telefono: [''],
    direccion: [''],
    coordenadas: [''],
    urlGoogleMaps: [''],
    imagenURL: [''],
  });

  public reglaForm: FormGroup = this.fb.group({
    descripcion: [''],
    categoria: [''],
  });

  public categorias: Categoria[] = [
    {
      display: 'Normas',
      value: 'Reglas de Cumplimiento Obligatorio',
      color: '#FF6B6B',
    },
    {
      display: 'Cobertura',
      value: 'Responsabilidades del Estacionamiento',
      color: '#4ECDC4',
    },
    {
      display: 'Exclusiones',
      value: 'Limitaciones de Responsabilidad',
      color: '#95A5A6',
    },
  ];

  OnChangedEstadoForm(): void {
    this.estadoForm.set(!this.estadoForm());
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  ngOnDestroy(): void {
    this.map?.remove();
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
          this.homeService.empresaInfo.set(info);
          this.inicializarDatos(info!);
        } catch (error) {
          console.error('Error al parsear datos del localStorage:', error);
          this.mostrarError(
            'No se encontraron datos pre almacenados de la empresa'
          );
        }
      } else {
        this.mostrarError('No se encontraron datos del perfil de la empresa');
      }
    }
  }

  private inicializarDatos(info: EmpresaInfo): void {
    if (info.photoUrl != '' && info.photoUrl != null) {
      this.imageEmpresa.set(info.photoUrl);
      this.estadoImagen.set(true);
    }

    this.perfilForm.patchValue({
      nombreParking: info.name,
      cantEspacios: info.cantidadEspacios,
      horarioAtencion: info.horarioAtencion,
      correoElectronico: info.email,
      telefono: info.telefono,
      direccion: info.direccion,
      coordenadas: info.coordenadas,
      urlGoogleMaps: info.urlGoogleMaps,
    });

    // Guardar el ID del parking para usarlo en las operaciones con reglas
    this.parkingId = info.idParking;

    // Cargar las reglas usando el servicio actualizado
    if (this.parkingId) {
      this.obtenerReglas();
    }
  }

  private inicializarMapa(): void {
    try {
      if (!this.divMap) return;

      this.map = new Map({
        container: this.divMap.nativeElement,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-63.18215133936172, -17.783253855301936],
        zoom: 17,
      });

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = 'url(assets/marcador-de-posicion.png)';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundSize = 'cover';

      this.marker = new Marker({
        element: el,
        draggable: true,
      })
        .setLngLat([-63.18215133936172, -17.783253855301936])
        .addTo(this.map);

      this.marker.on('dragend', () => {
        if (this.marker) {
          const lngLat = this.marker.getLngLat();
          this.perfilForm.patchValue({
            coordenadas: `${lngLat.lng.toFixed(6)},${lngLat.lat.toFixed(6)}`,
          });
        }
      });
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      this.mostrarError('Error al inicializar el mapa');
    }
  }

  guardarPerfil(): void {
    if (this.perfilForm.valid && this.parkingId) {
      const updateData = {
        name: this.perfilForm.value.nombreParking,
        photoUrl: this.perfilForm.value.imagenURL,
        numberOfSpaces: this.perfilForm.value.cantEspacios,
        openingHours: this.perfilForm.value.horarioAtencion,
        email: this.perfilForm.value.correoElectronico,
        cellphone: this.perfilForm.value.telefono,
        direction: this.perfilForm.value.direccion,
        coordinates: this.perfilForm.value.coordenadas,
        urlGoogleMaps: this.perfilForm.value.urlGoogleMaps,
      };

      const sub = this.perfilService
        .updatePerfil(this.parkingId, updateData)
        .subscribe({
          next: (response: any) => {
            const updatedInfo: EmpresaInfo = {
              ...this.homeService.empresaInfo()!,
              name: response.name,
              photoUrl: response.photoUrl || '',
              cantidadEspacios: response.numberOfSpaces || 0,
              horarioAtencion: response.openingHours || '',
              email: response.email,
              telefono: response.cellphone || '',
              direccion: response.direction || '',
              coordenadas: response.coordinates || '',
              urlGoogleMaps: response.urlGoogleMaps || '',
              ofertas: response.offers.map((offer: any) => ({
                id: offer.id,
                categoria: offer.title,
                nombre: offer.description,
                precio: offer.price,
                descuento: offer.discount,
              })),
              comunicados: response.announcements.map((announcement: any) => ({
                id: announcement.id,
                tipo: announcement.title,
                contenido: announcement.description,
              })),
              reglas: response.rules.map((rule: any) => ({
                id: rule.id,
                categoria: rule.title,
                descripcion: rule.description,
                color: this.getColorByTitle(rule.title),
              })),
            };

            // Actualizar el signal
            this.homeService.empresaInfo.set(updatedInfo);

            // Actualizar el localStorage
            localStorage.setItem('empresaInfo', JSON.stringify(updatedInfo));

            this.mostrarExito('Perfil actualizado exitosamente');
          },
          error: (error) => {
            console.error('Error al actualizar el perfil:', error);
            this.mostrarError('Error al actualizar el perfil');
          },
        });

      this.subscriptions.add(sub);
    } else {
      this.marcarCamposInvalidos(this.perfilForm);
    }
  }

  guardarRegla(): void {
    if (this.reglaForm.valid && this.parkingId) {
      const categoriaSeleccionada = this.categorias.find(
        (cat) => cat.display === this.reglaForm.value.categoria
      );

      if (categoriaSeleccionada) {
        const descripcion = this.reglaForm.value.descripcion;
        const categoria = categoriaSeleccionada.value;

        const sub = (
          this.reglaEnEdicion
            ? this.perfilService.updateRegla(this.reglaEnEdicion, {
                descripcion,
                categoria,
              })
            : this.perfilService.createRegla(
                this.parkingId,
                categoria,
                descripcion
              )
        ).subscribe({
          next: (regla) => {
            this.obtenerReglas();
            this.reglaForm.reset();
            this.reglaEnEdicion = null;
            this.mostrarExito('Regla guardada exitosamente');
          },
          error: (error) => {
            console.error('Error al guardar la regla:', error);
            this.mostrarError('Error al guardar la regla');
          },
        });
        this.subscriptions.add(sub);
      }
    } else {
      this.marcarCamposInvalidos(this.reglaForm);
    }
  }

  editarRegla(index: number): void {
    const regla = this.reglas[index];
    if (regla) {
      this.reglaEnEdicion = regla.id;
      const categoria = this.categorias.find(
        (cat) => cat.value === regla.categoria
      );
      this.reglaForm.patchValue({
        descripcion: regla.descripcion,
        categoria: categoria?.display || '',
      });
    }
  }

  private obtenerReglas(): void {
    if (!this.parkingId) return;

    const sub = this.perfilService.getReglas(this.parkingId).subscribe({
      next: (reglas) => {
        this.reglas = reglas;
      },
      error: (error) => {
        console.error('Error al cargar las reglas:', error);
        this.mostrarError('Error al cargar las reglas');
      },
    });
    this.subscriptions.add(sub);
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
        return '#95A5A6';
    }
  }

  seleccionarImagen(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const sub = this.perfilService.uploadToCloudinary(file).subscribe({
        next: (response) => {
          const imageUrl = response.secure_url;
          this.imageEmpresa.set(imageUrl);
          this.estadoImagen.set(true);

          if (this.perfilActual) {
            this.perfilService
              .updatePerfil(this.perfilActual.id, {
                imagenURL: imageUrl,
              })
              .subscribe({
                next: (perfilActualizado) => {
                  if (perfilActualizado) {
                    this.perfilActual = perfilActualizado;
                    this.perfilForm.patchValue({ imagenURL: imageUrl });
                    this.mostrarExito('Imagen cargada exitosamente');
                  }
                },
                error: (error) => {
                  console.error(
                    'Error al actualizar la imagen del perfil:',
                    error
                  );
                  this.mostrarError('Error al actualizar la imagen del perfil');
                },
              });
          } else {
            this.perfilForm.patchValue({ imagenURL: imageUrl });
            this.mostrarExito('Imagen cargada exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al cargar la imagen:', error);
          this.mostrarError('Error al cargar la imagen');
        },
      });
      this.subscriptions.add(sub);
    }
  }

  private marcarCamposInvalidos(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
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
