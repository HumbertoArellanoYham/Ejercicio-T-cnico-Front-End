export class FormComplements {

  // Validar la cantidad de de digitos en sku 
  static validarSku(sku: string): boolean{
    const skuLength = sku.toString().length;

    if(skuLength <= 6){
        return true;
    } else {
        return false;
    }
  }
}
