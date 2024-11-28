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
import { EmpresaInfo, HomeService } from './home.service';

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
  public homeService = inject(HomeService);

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
    nombreParking: [''],
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
    if (!this.loginForm) {
      console.error('El formulario no está inicializado');
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    console.log(email, password);

    if (!email || !password) {
      this.showModalWithTimer(
        'ERROR DE INICIO DE SESIÓN',
        'Todos los campos son obligatorios',
        'assets/modal-error.png'
      );
      return;
    }

    this.homeService.iniciarSesion(email, password).subscribe({
      next: (response: EmpresaInfo | false) => {
        if (response && 'idUsuario' in response) {
          this.homeService.empresaInfo.set(response);
          localStorage.setItem('empresaInfo', JSON.stringify(response));

          // Mostrar mensaje de éxito
          this.showModalWithTimer(
            '¡BIENVENIDO!',
            'Inicio de sesión exitoso, redirigiendo al dashboard...',
            'assets/modal-correcto.png'
          );

          // Esperar un momento antes de redirigir para que el usuario vea el mensaje
          setTimeout(() => {
            this.router.navigate(['/dashboard/perfil']);
          }, 2000); // 2 segundos de espera
        } else {
          this.showModalWithTimer(
            'ERROR DE INICIO DE SESIÓN',
            'Credenciales incorrectas',
            'assets/modal-error.png'
          );
        }
      },
      error: (error) => {
        console.error('Error en inicio de sesión:', error);
        this.showModalWithTimer(
          'ERROR DE INICIO DE SESIÓN',
          'Verifica la información ingresada e intenta nuevamente',
          'assets/modal-error.png'
        );
      },
    });
  }

  registrarmeParking(): void {
    if (!this.registerForm) {
      console.error('El formulario no está inicializado');
      return;
    }

    // Validación de campos del formulario
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const name = this.registerForm.get('nombreParking')?.value;
    const cellphone = this.registerForm.get('telefono')?.value;

    console.log(email, password, name, cellphone);

    // Verificar que todos los campos tengan valor
    if (!name || !email || !password || !cellphone) {
      this.showModalWithTimer(
        'ERROR DE REGISTRO',
        'Todos los campos son obligatorios',
        'assets/modal-error.png'
      );
      return;
    }

    const userData = {
      name,
      email,
      password,
      cellphone: String(cellphone),
      rol: 'manager',
    };

    this.homeService
      .registrarEmpresaParking(
        userData.name,
        userData.email,
        userData.password,
        userData.rol,
        userData.cellphone
      )
      .subscribe({
        next: (success: boolean) => {
          if (success) {
            this.showModalWithTimer(
              'REGISTRO EXITOSO',
              'Por favor inicia sesión con tus credenciales',
              'assets/modal-correcto.png'
            );
            this.registerForm.reset();
            setTimeout(() => {
              this.banderaFormAuth = false; // Cambiar al formulario de login
            }, 3000);
          } else {
            this.showModalWithTimer(
              'ERROR DE REGISTRO',
              'La información proporcionada es incompleta',
              'assets/modal-error.png'
            );
          }
        },
        error: (error) => {
          this.showModalWithTimer(
            'ERROR DE REGISTRO',
            'Verifica la información ingresada e intenta nuevamente',
            'assets/modal-error.png'
          );
        },
      });
  }
}
