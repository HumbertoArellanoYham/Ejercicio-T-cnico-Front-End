import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Familia } from '../interfaces/familia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasService {
  urlBaseFamilia = 'http://localhost:8080/familia';

  constructor(private httpClient: HttpClient) { }

  // Peticiones al servidor ABCC
  
  obtenerTodasLasFamilia(): Observable<Familia[]>{
    return this.httpClient.get<Familia[]>(`${this.urlBaseFamilia}/familia-todas`);
  }

  buscarPorNum(num: number): Observable<Familia> {
    return this.httpClient.get<Familia>(`${this.urlBaseFamilia}/obtenerPorNum/${num}`);
  }

  buscarPorNombre(nombreFamilia: string): Observable<number> {
    return this.httpClient.get<number>(`${this.urlBaseFamilia}/obtenerPorNombre/${nombreFamilia}`);
  }
}
