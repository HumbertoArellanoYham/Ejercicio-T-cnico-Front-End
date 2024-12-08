import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Clase } from '../interfaces/clase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {

  urlBaseClase = 'http://localhost:8080/clase';

  constructor(private httpClient: HttpClient) { }

  // Peticiones al servidor ABCC
  
  obtenerTodasLasClases(): Observable<Clase[]>{
    return this.httpClient.get<Clase[]>(`${this.urlBaseClase}/clase-todas`);
  }

  buscarPorNum(num: number): Observable<Clase> {
    return this.httpClient.get<Clase>(`${this.urlBaseClase}/obtenerPorNum/${num}`);
  }

  buscarPorNombre(nombreClase: string): Observable<number> {
    return this.httpClient.get<number>(`${this.urlBaseClase}/obtenerPorNombre/${nombreClase}`);
  }
}
