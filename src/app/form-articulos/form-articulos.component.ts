import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';

// imports material design
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';

// Forms import 
import {FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-articulos',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule, 
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-articulos.component.html',
  styleUrl: './form-articulos.component.css'
})
export class FormArticulosComponent {
  private formBuilder = inject(FormBuilder);
  departamentoSeleccionado: string = '';

  formArticulos = this.formBuilder.group({
    sku: ['', [Validators.required, Validators.maxLength(6)]],
    descontinuado: [''],
    articulo: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    clase: ['', [Validators.required]],
    familia: ['', [Validators.required]],
    stock: ['', [Validators.required]],
    cantidad: ['', [Validators.required]],
    fechaAlta: ['', [Validators.required]],
    fechaBaja: ['', [Validators.required]]
  });

  constructor(){}
}
