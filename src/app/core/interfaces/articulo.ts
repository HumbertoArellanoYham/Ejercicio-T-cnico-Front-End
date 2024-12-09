export interface Articulo {
    sku?: number; 
    articulo: string;
    marca: string;
    modelo: string;
    departamento: number;
    clase: number;
    familia: number;
    fechaAlta: Date;
    stock: number;
    cantidad: number;
    descontinuado: number;
    fechaBaja: Date
}
