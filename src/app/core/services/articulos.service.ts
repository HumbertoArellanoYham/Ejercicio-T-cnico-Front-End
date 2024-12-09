import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Articulo } from '../interfaces/articulo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
  urlBaseArticle = 'http://localhost:8080/articulos';

  constructor(private httpClient: HttpClient) { }

  // Peticiones al servidor ABCC

  buscarArticuloPorSku(sku: number): Observable<Articulo> {
    return this.httpClient.get<Articulo>(`${this.urlBaseArticle}/obtenerPorSku/${sku}`);
  }

  updateArticulo(articulo: Articulo): Observable<Articulo> {
    return this.httpClient.patch<Articulo>(`${this.urlBaseArticle}/actualizarArticulo`, articulo);
  }

  saveArticulo(articulo: Articulo): Observable<Articulo> {
    return this.httpClient.post<Articulo>(`${this.urlBaseArticle}/guardarArticulo`, articulo);
  }

  removePorSku(sku: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.urlBaseArticle}/eliminarPorSku/${sku}`);
  }
}
