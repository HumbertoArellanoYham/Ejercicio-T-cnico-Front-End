import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CommonModule, formatDate } from '@angular/common'; 

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Alert
import swal from 'sweetalert2';

// imports material design
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

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

// Componentes
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

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
    MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-articulos.component.html',
  styleUrl: './form-articulos.component.css'
})
export class FormArticulosComponent {
  private formBuilder = inject(FormBuilder);

  // Fecha Actual
  fecha = new Date(formatDate(new Date(), 'yyyy-MM-dd', 'en-US')); 

  // Arreglos para el mat-select
  departamentosSelect: Departamento[] = [];
  claseSelect: Clase[] = [];
  familiaSelect: Familia[] = [];

  // Botones propiedades para habilitar
  eliminarBotonDesahabilitado = true;
  actualizarBotonDesahabilitado = true;
  guardarBotonDesahabilitado = true;
  otroArticulo = true;

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
    private familiaService: FamiliasService,
    private dialog: MatDialog
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

          this.obtenerNombreDepartamentoClaseFamilia(item.departamento, item.clase, item.familia);

          // Llenar el formulario
          this.formArticulos.patchValue({
            'articulo': item.articulo,
            'marca': item.marca,
            'modelo': item.modelo,
            'departamento': this.departamentoSeleccionado, 
            'clase': this.claseSeleccionada,
            'familia': this.familiaSeleccionada,
            'fechaAlta': this.formatFecha(item.fechaAlta),
            'stock': item.stock.toString(),
            'cantidad': item.cantidad.toString(),
            'descontinuado': item.descontinuado == 0? false : true,
            'fechaBaja': this.formatFecha(item.fechaBaja),
          });
        }
      });
    }
  }

  // Operaciones del ABCC
  guardarArticulo(){
    const stockForm: number = +(this.formArticulos.get('stock')?.value!);
    const cantidadForm: number = +(this.formArticulos.get('cantidad')?.value!);

    // Validar que stock y cantidad no superen 9 dígitos
    if (stockForm.toString().length > 9 || cantidadForm.toString().length > 9) {
      swal.fire({
        title: "Error",
        text: "El stock o la cantidad no pueden superar los 9 dígitos.",
        icon: "error",
      });
      return; 
    }

    // validar que sean numeros positivos
    if(stockForm < 0 || cantidadForm < 0){
      return;
    }

    if(this.formArticulos.valid && stockForm >= cantidadForm){
      const nuevoArticulo:Articulo = {
        sku: +(this.formArticulos.get('sku')?.value || 0),
        articulo: this.formArticulos.get('articulo')?.value || '',
        marca: this.formArticulos.get('marca')?.value || '',
        modelo: this.formArticulos.get('modelo')?.value || '',
        departamento: this.numeroDelDepartamentoSeleccionado(),
        clase: this.numeroDeLaClaseSeleccionada(),
        familia: this.numeroDeLaFamiliaSeleccionada(),
        fechaAlta: this.fecha,
        stock: stockForm,
        cantidad: cantidadForm,
        descontinuado: 0,
        fechaBaja: new Date(1900, 0, 1)
      }


      this.articuloService.saveArticulo(nuevoArticulo).subscribe((item) => {
        console.log(item);
      })

      this.formArticulos.reset();

      // Habilitar los campos 
      this.formArticulos.get('articulo')?.disable();
      this.formArticulos.get('marca')?.disable();
      this.formArticulos.get('modelo')?.disable();
      this.formArticulos.get('departamento')?.disable();
      this.formArticulos.get('cantidad')?.disable();
      this.formArticulos.get('stock')?.disable();

      this.formArticulos.get('sku')?.enable();
      this.guardarBotonDesahabilitado = true;
      this.otroArticulo = true;
      
      swal.fire({
        title: "Se agrego el articulo correctamente!",
        text: "Excelente, agrega mas",
        icon: "success"
      });
    }

  }

  eliminarArticulo(){
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: {
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas eliminar este artículo?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articuloService.removePorSku(+(this.formArticulos.get('sku')?.value || 0)).subscribe(item => {
        console.log(item, 'Artículo eliminado');

        // Si se elimino limpiar formulario y eliminar y deshabilitar etiquetas
        this.formArticulos.get('articulo')?.disable();
        this.formArticulos.get('marca')?.disable();
        this.formArticulos.get('modelo')?.disable();
        this.formArticulos.get('departamento')?.disable();
        this.formArticulos.get('cantidad')?.disable();
        this.formArticulos.get('stock')?.disable();
        this.formArticulos.get('descontinuado')?.disable();

        this.formArticulos.get('sku')?.enable();
        this.actualizarBotonDesahabilitado = true;
        this.eliminarBotonDesahabilitado = true;
        this.otroArticulo = true;
        this.guardarBotonDesahabilitado = true;
        });

        this.formArticulos.reset();

      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  actualizarArticulo(){
    const stockForm: number = +(this.formArticulos.get('stock')?.value!);
    const cantidadForm: number = +(this.formArticulos.get('cantidad')?.value!);

    // Validar que stock y cantidad no superen 9 dígitos
    if (stockForm.toString().length > 9 || cantidadForm.toString().length > 9) {
      swal.fire({
        title: "Error",
        text: "El stock o la cantidad no pueden superar los 9 dígitos.",
        icon: "error",
      });
      return; 
    }

    if(this.formArticulos.valid && stockForm >= cantidadForm){

      const estaDescontinuado: boolean = this.formArticulos.get('descontinuado')?.value!;

      const nuevoArticulo: Articulo = {
        sku: +(this.formArticulos.get('sku')?.value || 0),
        articulo: this.formArticulos.get('articulo')?.value || '',
        marca: this.formArticulos.get('marca')?.value || '',
        modelo: this.formArticulos.get('modelo')?.value || '',
        departamento: this.numeroDelDepartamentoSeleccionado(),
        clase: this.numeroDeLaClaseSeleccionada(),
        familia: this.numeroDeLaFamiliaSeleccionada(),
        fechaAlta: this.fecha,
        stock: stockForm,
        cantidad: cantidadForm,
        descontinuado: estaDescontinuado ? 1 : 0,
        fechaBaja: estaDescontinuado ? this.fecha : new Date(1900, 0, 1)
      }


      this.articuloService.updateArticulo(nuevoArticulo).subscribe((item) => {
        console.log(item);
      });

      this.formArticulos.reset();


      this.formArticulos.get('articulo')?.disable();
      this.formArticulos.get('marca')?.disable();
      this.formArticulos.get('modelo')?.disable();
      this.formArticulos.get('departamento')?.disable();
      this.formArticulos.get('cantidad')?.disable();
      this.formArticulos.get('stock')?.disable();
      this.formArticulos.get('descontinuado')?.disable();

      this.formArticulos.get('sku')?.enable();
      this.actualizarBotonDesahabilitado = true;
      this.eliminarBotonDesahabilitado = true;
      this.otroArticulo = true;
    }
  }

  otroArticuloBuscar(){
    this.formArticulos.reset();

    this.formArticulos.get('articulo')?.disable();
    this.formArticulos.get('marca')?.disable();
    this.formArticulos.get('modelo')?.disable();
    this.formArticulos.get('departamento')?.disable();
    this.formArticulos.get('cantidad')?.disable();
    this.formArticulos.get('stock')?.disable();
    this.formArticulos.get('descontinuado')?.disable();

    this.formArticulos.get('sku')?.enable();
    this.actualizarBotonDesahabilitado = true;
    this.eliminarBotonDesahabilitado = true;
    this.otroArticulo = true;

  }

  // Encontrar el numero de cada seleccion 
  numeroDelDepartamentoSeleccionado(): number {
    var numDepartamento = 0;

    for (let index = 0; index < this.departamentosSelect.length; index++) {
      if(this.departamentosSelect[index].nombreDepartamento === this.departamentoSeleccionado){
        numDepartamento = this.departamentosSelect[index].idDepartamento!;
      }
    }

    return numDepartamento;
  }

  numeroDeLaClaseSeleccionada(): number {
    var numClase = 0;

    for (let index = 0; index < this.claseSelect.length; index++) {
      if(this.claseSelect[index].nombreClase === this.claseSeleccionada){
        numClase = this.claseSelect[index].idClase!;
      }
    }

    return numClase;
  }

  numeroDeLaFamiliaSeleccionada(): number {
    var numFamilia = 0;

    for (let index = 0; index < this.familiaSelect.length; index++) {
      if(this.familiaSelect[index].nombreFamilia === this.familiaSeleccionada){
        numFamilia = this.familiaSelect[index].idFamilia!;
      }
    }

    return numFamilia;
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

    this.otroArticulo = false;
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

    this.otroArticulo = false;
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

  // Formato de fecha
  formatFecha(fecha: string | Date | null): string {
    if (!fecha) return '';
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) return ''; 
    
    fechaDate.setDate(fechaDate.getDate() + 1);
    
    return fechaDate.toISOString().split('T')[0];
  }

  /* Obtener el nombre del departamento - clase - familia de acuerdo al articulo extraido de la API Spring
  * Cada articulo se extrae con el numbero del departamento y este nesesita ser el nombre 
  *
  * @Param Objeto Departamento idDepartamento1
  * @Return 'ELECTRONICA'
  * 
  * Importante a tomar en cuenta:
  * Esto se hace con la finalidad de que como ya tenemos todo el arreglo enlazado con sus departamentos,
  * clases y familias no se nesesita volver a realizar una peticion por cada mat-select.
  * 
  * Se podria pensar que es mas costoso en complejidad temporal pero no es asi porque tenemos un 
  * conjunto de datos finito y cada bucle se realiza de manera independiente por lo que como 
  * complejidad temporal y espacial quedaria asi:
  *     Temporal: O(n) -> pero como es finito se reduce bastante 
  *     Espacial: O(1) -> no se nesesito estructuras de datos adicional
  */
  obtenerNombreDepartamentoClaseFamilia(idDepartamento: number, idClase: number, idFamilia: number): void{
    let claseSet: Clase[] = [];
    let familiaSet: Familia[] = [];

    for (let index = 0; index < this.departamentosSelect.length; index++) {
      if(this.departamentosSelect[index].idDepartamento == idDepartamento){
        this.departamentoSeleccionado = this.departamentosSelect[index].nombreDepartamento;
        claseSet = this.departamentosSelect[index].claseSet!;
      }
    }

    for (let index = 0; index < claseSet.length; index++) {
      if(claseSet[index].idClase == idClase){
        this.claseSeleccionada = claseSet[index].nombreClase;
        familiaSet = claseSet[index].familiaSet!;
      }
    }

    for (let index = 0; index < familiaSet.length; index++) {
      if(familiaSet[index].idFamilia == idFamilia){
        this.familiaSeleccionada = familiaSet[index].nombreFamilia;
      } 
    }
  }

}
