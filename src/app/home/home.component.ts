import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent
  implements OnInit, OnDestroy, AfterViewInit, OnDestroy
{
  public router = inject(Router);
  // LOGIC : MODAL HTML
  @ViewChild('modalHTML') modalHTML?: ElementRef;
  public modalVisible: boolean = false;
  public modalTitle: string = 'HUBO PROBLEMAS CON LOS RESULTADOS';
  public modalSubtitle: string = 'Por favor, verifica la información ingresada';
  // public imageModal: string = 'assets/modal-error.png';
  public imageModal: string = 'assets/modal-correcto.png';
  private modalTimer: any;

  // LOGIC : FORMULARIO LOGIN
  @ViewChild('formLogin') formLogin?: ElementRef;
  public formVisible: boolean = false;
  // LOGIC : BANDERA FORMULARIO (LOGIN/REGISTRO)
  // LOGIC : true = REGISTRO | false = LOGIN
  public banderaFormAuth: boolean = true;

  public formBuilder = inject(FormBuilder);
  public loginForm: FormGroup = this.formBuilder.group({
    email: [''],
    password: [''],
    confirmPassword: [''],
  });
  public registerForm: FormGroup = this.formBuilder.group({
    email: [''],
    password: [''],
    codigoPago: [''],
    telefono: [''],
  });

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.modalHTML?.nativeElement.addEventListener(
      'click',
      this.cerrarModal.bind(this)
    );
  }
  ngOnDestroy(): void {
    this.modalHTML?.nativeElement.removeEventListener(
      'click',
      this.cerrarModal.bind(this)
    );
    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
    }
    this.modalHTML?.nativeElement.removeEventListener(
      'click',
      this.cerrarModal.bind(this)
    );
  }

  onChagendFormAuth(): void {
    this.banderaFormAuth = !this.banderaFormAuth;
  }

  cerrarModal(event: any): void {
    if (event.target == this.modalHTML?.nativeElement) {
      this.modalVisible = false;
    }
  }

  private showModalWithTimer(
    title: string,
    subtitle: string,
    image: string,
    duration: number = 5000
  ): void {
    this.modalTitle = title;
    this.modalSubtitle = subtitle;
    this.imageModal = image;
    this.modalVisible = true;

    this.modalTimer = setTimeout(() => {
      this.modalVisible = false;
    }, duration);
  }

  iniciarParking(): void {
    try {
      // Aquí iría tu lógica de login
      // Si es exitoso:
      this.showModalWithTimer(
        'INICIO DE SESIÓN EXITOSO',
        'Redirigiendo al dashboard...',
        'assets/modal-correcto.png'
      );
      setTimeout(() => {
        this.router.navigate(['dashboard', 'perfil']);
      }, 5000);
    } catch (error) {
      this.showModalWithTimer(
        'ERROR DE INICIO DE SESIÓN',
        'Verifica tus credenciales e intenta nuevamente',
        'assets/modal-error.png'
      );
    }
  }

  registrarmeParking(): void {
    try {
      // Aquí iría tu lógica de registro
      // Si es exitoso:
      this.showModalWithTimer(
        'REGISTRO EXITOSO',
        'Por favor inicia sesión con tus credenciales',
        'assets/modal-correcto.png'
      );
      this.registerForm.reset();
      setTimeout(() => {
        this.banderaFormAuth = false; // Cambiar al formulario de login
      }, 5000);
    } catch (error) {
      this.showModalWithTimer(
        'ERROR DE REGISTRO',
        'Verifica la información ingresada e intenta nuevamente',
        'assets/modal-error.png'
      );
    }
  }
}
