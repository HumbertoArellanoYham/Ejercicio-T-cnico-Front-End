export class FormComplements {

  // Validar la cantidad de de digitos en sku 
  static validarSku(sku: string): boolean{
    const skuLength = sku.toString().length;
    const skuValorPositivo = +sku;

    if(skuLength <= 6 && skuValorPositivo > 0){
        return true;
    } else {
        return false;
    }
  }
}
