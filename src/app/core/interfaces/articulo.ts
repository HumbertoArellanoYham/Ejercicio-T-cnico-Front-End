export interface Articulo {
    sku?: number; 
    articulo: string;
    marca: string;
    modelo: string;
    departamento: number;
    clase: string;
    familia: string;
    fechaAlta: Date;
    stock: number;
    cantidad: number;
    descontinuado: number;
    FechaBaja: Date
}
