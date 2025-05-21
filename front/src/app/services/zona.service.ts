import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Zona } from '../models/zona.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  constructor(private api: ApiService) {}

  getZonas(filters?: { departamento?: string, tipo_proceso?: string }): Observable<Zona[]> {
    let endpoint = 'zonas-deforestadas/';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.departamento) params.append('departamento', filters.departamento);
      if (filters.tipo_proceso) params.append('tipo_proceso', filters.tipo_proceso);
      endpoint += `?${params.toString()}`;
    }
    const promise = this.api.get(endpoint);
    return from(promise);
  }

  getZona(id: number): Observable<Zona> {
    const promise = this.api.get(`zonas-deforestadas/${id}`);
    return from(promise);
  }

  createZona(zona: Zona): Observable<Zona> {
    const promise = this.api.post('zonas-deforestadas/', zona);
    return from(promise);
  }

  updateZona(id: number, zona: Zona): Observable<Zona> {
    const promise = this.api.put(`zonas-deforestadas/${id}`, zona);
    return from(promise);
  }

  deleteZona(id: number): Observable<any> {
    const promise = this.api.delete(`zonas-deforestadas/${id}`);
    return from(promise);
  }
}