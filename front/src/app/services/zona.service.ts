import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Zona } from '../models/zona.model';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  constructor(private api: ApiService) {}

  getZonas(filters?: { departamento?: string, tipo_proceso?: string }) {
    let endpoint = 'zonas-deforestadas/';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.departamento) params.append('departamento', filters.departamento);
      if (filters.tipo_proceso) params.append('tipo_proceso', filters.tipo_proceso);
      endpoint += `?${params.toString()}`;
    }
    return this.api.get(endpoint);
  }

  getZona(id: number) {
    return this.api.get(`zonas-deforestadas/${id}`);
  }

  createZona(zona: Zona) {
    return this.api.post('zonas-deforestadas/', zona);
  }

  updateZona(id: number, zona: Zona) {
    return this.api.put(`zonas-deforestadas/${id}`, zona);
  }

  deleteZona(id: number) {
    return this.api.delete(`zonas-deforestadas/${id}`);
  }
}