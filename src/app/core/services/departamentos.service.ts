import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Departamento } from '../interfaces/departamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {
  urlBaseDepartamento = 'http://localhost:8080/departamento';

  constructor(private httpClient: HttpClient) { }

  // Peticiones al servidor ABCC
  
  obtenerTodosLosDepartamentos(): Observable<Departamento[]>{
    this.httpClient.get<Departamento[]>(`${this.urlBaseDepartamento}/departamentos-todos`);
  }

  buscarPorNum(num: number): Observable<Departamento> {
    this.httpClient.get<Departamento>(`${this.urlBaseDepartamento}/obtenerPorNum/${num}`);
  }

  buscarPorNombre(nombreDepartamento: string): Observable<number> {
    this.httpClient.get<number>(`${this.urlBaseDepartamento}/obtenerPorNombre/${nombreDepartamento}`);
  }
}
