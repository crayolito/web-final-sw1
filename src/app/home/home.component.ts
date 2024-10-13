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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public router = inject(Router);
  // LOGIC : MODAL HTML
  @ViewChild('modalHTML') modalHTML?: ElementRef;
  public modalVisible: boolean = false;
  // LOGIC : FORMULARIO LOGIN
  @ViewChild('formLogin') formLogin?: ElementRef;
  public formVisible: boolean = false;

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.modalHTML?.nativeElement.addEventListener(
      'click',
      this.cerrarModal.bind(this)
    );
    this.formLogin?.nativeElement.addEventListener(
      'click',
      this.cerrarForm.bind(this)
    );
  }
  ngOnDestroy(): void {
    this.modalHTML?.nativeElement.removeEventListener(
      'click',
      this.cerrarModal.bind(this)
    );
    this.formLogin?.nativeElement.removeEventListener(
      'click',
      this.cerrarForm.bind(this)
    );
  }

  cerrarModal(event: any): void {
    if (event.target == this.modalHTML?.nativeElement) {
      this.modalVisible = false;
    }
  }

  cerrarForm(event: any): void {
    if (event.target == this.formLogin?.nativeElement) {
      this.formVisible = false;
    }
  }

  iniciarParking(): void {
    this.router.navigate(['dashboard', 'perfil']);
  }

  registrarmeParking(): void {
    this.router.navigate(['dashboard', 'perfil']);
  }
}
