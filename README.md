# Desarrollo: Formulario de articulos

## Tecnologías utilizadas
  *  Angular 17
  *  TypeScript
  *  Angular Material Design

## Uso por parte del usuario 
Al ingresar al programa el usuario resonsable podra visualizar la pagina principal que al seleccionar
se redigira al fomulario de registro de articulos, aqui podra actualizar, guardar, buscar o eliminar 
dependiendo lo que quiera realizar.

Es importante tomar en cuenta la eficiencia y el ser sutil en la prevencion de errores ya que el 
usuario nesesita sentirse comodo al utilizarlo.

## Mejoras
Se implemento un boton extra llamado 'Otro articulo', supongamos el siguiente escenario donde el usuario
ingresa un sku para buscar un articulo y resulta que se equivoco e ingreso mal el sku y quiere otro 
articulo bueno no tendria forma de hacerlo sin recargar la pagina, aqui es donde se utiliza este boton
y sin problemas podra ingresar otro sku.

## Validaciones 
  * El Sku del articulo no debe ser mayor a 6 digitos
  * Botones habilitados o deshabilitados dependiendo la operacion a realizar
  * La cantidad no debe ser mayor al stock tanto al actualizar como al guardar
  * Ventana de alerta para preguntar si desea eliminar un articulo


<img width="1277" alt="Screen Shot 2024-12-08 at 21 12 08" src="https://github.com/user-attachments/assets/bc35614f-c760-4e08-a653-a33555528e17">


<img width="1277" alt="Screen Shot 2024-12-08 at 21 12 35" src="https://github.com/user-attachments/assets/425080c2-00e8-467f-b7b9-0ab1b885b867">


<img width="1277" alt="Screen Shot 2024-12-08 at 21 12 46" src="https://github.com/user-attachments/assets/ba2a4a7c-6c1d-435b-bbf8-587ae76cd10d">


## Desafios y soluciones presentadas
Obtener el nombre del departamento - clase - familia de acuerdo al articulo extraido de la API Spring
Cada articulo se extrae con el numero del departamento y este nesesita ser el nombre 
  
  *  @Param Objeto Departamento idDepartamento1
  *  @Return 'ELECTRONICA'
   
Importante a tomar en cuenta:
   Esto se hace con la finalidad de que como ya tenemos todo el arreglo enlazado con sus departamentos,
   clases y familias no se nesesita volver a realizar una peticion por cada mat-select.
   
   Se podria pensar que es mas costoso en complejidad temporal pero no es asi porque tenemos un 
   conjunto de datos finito y cada bucle se realiza de manera independiente por lo que como 
   complejidad temporal y espacial quedaria asi:
     * Temporal: O(n) -> pero como es finito se reduce bastante 
     * Espacial: O(1) -> no se nesesito estructuras de datos adicional


## Funcionalidades a tomar en cuenta en un futuro
## Despliegue en AWS
* Dentro de la nube de amazon web services nos proporciona diferentes servicios para desplegar como lo son:
     * Bucket S3: para Angular
     * Elastic BeanStalk: Java - Spring boot - API REST
     * RDS: para la base de datos

* Sin embargo se tiene que tomar en cuenta el costo asociado

## Diagrama

![Screen Shot 2024-12-08 at 20 10 01](https://github.com/user-attachments/assets/5b14cb35-17f5-4fa1-9cb3-29a313889ddd)







