import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
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

// Services
import { ArticulosService } from '../../app/core/services/articulos.service';
import { ClasesService } from '../../app/core/services/clases.service';
import { DepartamentosService } from '../../app/core/services/departamentos.service';
import { FamiliasService } from '../../app/core/services/familias.service';
 
// Interfaces 
import { Articulo } from '../../app/core/interfaces/articulo';
import { Clase } from '../../app/core/interfaces/clase';
import { Departamento } from '../../app/core/interfaces/departamento';
import { Familia } from '../../app/core/interfaces/familia';

// Clases
import { FormComplements } from './form-complements';

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

  departamentosSelect: Departamento[] = [];
  claseSelect: Clase[] = [];
  familiaSelect: Familia[] = [];

  // Botones propiedades para habilitar
  eliminarBotonDesahabilitado = true;
  actualizarBotonDesahabilitado = true;
  guardarBotonDesahabilitado = true;

  // Variables 
  departamentoSeleccionado: string = '';
  claseSeleccionada: string = '';
  familiaSeleccionada: string = '';
  articuloFound!: Articulo;

  // Formulario reactivo inicar con los campos deshabilitados
  formArticulos = this.formBuilder.group({
    sku: ['', [Validators.required, Validators.maxLength(6)]],
    descontinuado: [{value: false, disabled:true}],
    articulo: [{value: '', disabled:true}, [Validators.required]],
    marca: [{value: '', disabled:true}, [Validators.required]],
    modelo: [{value: '', disabled:true}, [Validators.required]],
    departamento: [{value: '', disabled:true}, [Validators.required]],
    clase: [{value: '', disabled:true}, [Validators.required]],
    familia: [{value: '', disabled:true}, [Validators.required]],
    stock: [{value: '', disabled:true}, [Validators.required]],
    cantidad: [{value: '', disabled:true}, [Validators.required]],
    fechaAlta: [{value: '', disabled:true}, [Validators.required]],
    fechaBaja: [{value: '', disabled:true}, [Validators.required]]
  });

  constructor(
    // Injectar los servicios
    private articuloService: ArticulosService,
    private departamentoService: DepartamentosService,
    private claseService: ClasesService,
    private familiaService: FamiliasService
  ){}

  ngOnInit(): void {
    this.departamentoService.obtenerTodosLosDepartamentos().subscribe(item => {
      this.departamentosSelect = item;
      console.log(this.departamentosSelect);
    });

    this.habilitarElMatSelect();
  }

  // Buscar el sku para ver si se encuentra primero se realizan las validaciones correspondientes 
  verificarSku(event: KeyboardEvent): void {
    const skuFound =  this.formArticulos.get('sku')?.value ?? '';

    if(event.key == 'Enter' && this.formArticulos.get('sku')?.valid && 
      FormComplements.validarSku(skuFound)){

      console.log('Presionaste la tecla enter');

      this.articuloService.buscarArticuloPorSku(+skuFound).subscribe((item) => {
        this.articuloFound = item;
        console.log(this.articuloFound);
          
        if(item == null){
          this.habilitarCamposParaAgregarUnArticulo();
        } else {
          this.habilitarCamposParaActualizarArticulo();
        }
      });
    }
  }

  // Habilitar los campos dependiendo la operacion a realizar
  habilitarCamposParaAgregarUnArticulo(): void {
    this.formArticulos.get('articulo')?.enable();
    this.formArticulos.get('marca')?.enable();
    this.formArticulos.get('modelo')?.enable();
    this.formArticulos.get('departamento')?.enable();
    this.formArticulos.get('cantidad')?.enable();
    this.formArticulos.get('stock')?.enable();

    this.formArticulos.get('sku')?.disable();
    this.guardarBotonDesahabilitado = false;
  }

  habilitarCamposParaActualizarArticulo(): void {
    this.formArticulos.get('articulo')?.enable();
    this.formArticulos.get('marca')?.enable();
    this.formArticulos.get('modelo')?.enable();
    this.formArticulos.get('departamento')?.enable();
    this.formArticulos.get('cantidad')?.enable();
    this.formArticulos.get('stock')?.enable();
    this.formArticulos.get('descontinuado')?.enable();

    this.formArticulos.get('sku')?.disable();
    this.actualizarBotonDesahabilitado = false;
    this.eliminarBotonDesahabilitado = false;
  }

  habilitarElMatSelect(): void {
    // Deshabilitar los campos en el mat-select clase y familia
    this.formArticulos.get('departamento')?.valueChanges.subscribe((value) => {
      if (value) {
        this.selecionarClasePorDepartamento();
        this.formArticulos.get('clase')?.enable();
      } else {
        this.formArticulos.get('clase')?.disable();
      }
    });

    this.formArticulos.get('clase')?.valueChanges.subscribe((value) => {
      if (value) {
        this.selecionarFamiliaPorClase();
        this.formArticulos.get('familia')?.enable();
      } else {
        this.formArticulos.get('familia')?.disable();
      }
    });
  }


  // Llenar los mat-select dependiendo la seleccion
  selecionarClasePorDepartamento(): void {
    for (let index = 0; index < this.departamentosSelect.length; index++) {
      if(this.departamentosSelect[index].nombreDepartamento === this.departamentoSeleccionado){
        this.claseSelect = this.departamentosSelect[index].claseSet ?? [];
      } 
    }
  }

  selecionarFamiliaPorClase(): void {
    for (let index = 0; index < this.claseSelect.length; index++) {
      if(this.claseSelect[index].nombreClase === this.claseSeleccionada){
        this.familiaSelect = this.claseSelect[index].familiaSet ?? [];
      } 
    }
  }

}
