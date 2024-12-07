import { Clase } from './clase';

export interface Departamento {
    idDepartamento?: number;
    nombreDepartamento: string;
    claseSet?: Clase[];
}
