import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-informe',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './informe.component.html',
  styleUrl: './informe.component.css',
})
export default class InformeComponent {}
