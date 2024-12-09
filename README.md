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

![Screen Shot 2024-12-05 at 22 54 25](https://github.com/user-attachments/assets/dc62cece-8c50-464f-8a73-c7c45967737b)

## Funcionalidades a tomar en cuenta en un futuro
## Despliegue en AWS
* Dentro de la nube de amazon web services nos proporciona diferentes servicios para desplegar como lo son:
     * Bucket S3: para Angular
     * Elastic BeanStalk: Java - Spring boot - API REST
     * RDS: para la base de datos

* Sin embargo se tiene que tomar en cuenta el costo asociado



