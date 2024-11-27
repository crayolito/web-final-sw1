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
  private modalService = inject(ModalService);
  private subscriptions: Subscription = new Subscription();

  // Signals para la imagen
  public imageEmpresa = signal<string>('assets/subir-imagen.png');
  public estadoImagen = signal<boolean>(false);

  // Estado del perfil y reglas
  public estadoForm = signal<boolean>(false);
  public perfilActual: Perfil | null = null;
  public reglas: Regla[] = [];
  public reglaEnEdicion: string | null = null;

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
    const perfilesSub = this.perfilService.getPerfiles().subscribe({
      next: (perfiles) => {
        if (perfiles.length > 0) {
          this.perfilActual = perfiles[0];
          this.perfilForm.patchValue(this.perfilActual);

          // Actualizar el signal de imagen si existe una URL
          if (this.perfilActual.imagenURL) {
            this.imageEmpresa.set(this.perfilActual.imagenURL);
            this.estadoImagen.set(true);
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.mostrarError('Error al cargar los datos del perfil');
      },
    });

    const reglasSub = this.perfilService.getReglas().subscribe({
      next: (reglas) => {
        this.reglas = reglas;
      },
      error: (error) => {
        console.error('Error al cargar las reglas:', error);
        this.mostrarError('Error al cargar las reglas');
      },
    });

    this.subscriptions.add(perfilesSub);
    this.subscriptions.add(reglasSub);
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
    if (this.perfilForm.valid) {
      const perfilData = this.perfilForm.value;
      const sub = (
        this.perfilActual
          ? this.perfilService.updatePerfil(this.perfilActual.id, perfilData)
          : this.perfilService.createPerfil(perfilData)
      ).subscribe({
        next: (perfil) => {
          if (perfil) {
            this.perfilActual = perfil;
            this.modalService.show({
              title: 'Éxito',
              subtitle: 'Perfil guardado exitosamente',
              image: 'assets/modal-correcto.png',
              duration: 3000,
            });
          }
        },
        error: (error) => {
          console.error('Error al guardar el perfil:', error);
          this.mostrarError('Error al guardar el perfil');
        },
      });
      this.subscriptions.add(sub);
    } else {
      this.marcarCamposInvalidos(this.perfilForm);
    }
  }

  guardarRegla(): void {
    if (this.reglaForm.valid) {
      const categoriaSeleccionada = this.categorias.find(
        (cat) => cat.display === this.reglaForm.value.categoria
      );

      if (categoriaSeleccionada) {
        const nuevaRegla = {
          descripcion: this.reglaForm.value.descripcion,
          categoria: categoriaSeleccionada.display,
          color: categoriaSeleccionada.color,
        };

        const sub = (
          this.reglaEnEdicion
            ? this.perfilService.updateRegla(this.reglaEnEdicion, nuevaRegla)
            : this.perfilService.createRegla(nuevaRegla)
        ).subscribe({
          next: (regla) => {
            if (regla) {
              // En lugar de modificar el array directamente,
              // recargamos todas las reglas
              this.obtenerReglas();
              this.reglaForm.reset();
              this.reglaEnEdicion = null;
              this.mostrarExito('Regla guardada exitosamente');
            }
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
      this.reglaForm.patchValue({
        descripcion: regla.descripcion,
        categoria: regla.categoria,
      });
    }
  }

  eliminarRegla(index: number): void {
    const regla = this.reglas[index];
    if (regla) {
      const sub = this.perfilService.deleteRegla(regla.id).subscribe({
        next: (success) => {
          if (success) {
            // En lugar de modificar el array directamente,
            // recargamos todas las reglas
            this.obtenerReglas();
            this.mostrarExito('Regla eliminada exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al eliminar la regla:', error);
          this.mostrarError('Error al eliminar la regla');
        },
      });
      this.subscriptions.add(sub);
    }
  }

  // Añade este método privado para recargar las reglas
  private obtenerReglas(): void {
    const sub = this.perfilService.getReglas().subscribe({
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

  seleccionarImagen(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const sub = this.perfilService.uploadToCloudinary(file).subscribe({
        next: (response) => {
          const imageUrl = response.secure_url;
          this.imageEmpresa.set(imageUrl);
          this.estadoImagen.set(true);

          // Actualizar el perfil con la nueva URL de imagen
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
            // Si no hay perfil actual, solo actualiza el formulario
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
