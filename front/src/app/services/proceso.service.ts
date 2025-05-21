import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { from, Observable } from 'rxjs';
import { Proceso } from '../models/proceso.model';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  constructor(private api: ApiService) {}

  getProcesos(): Observable<Proceso[]> {
    let endpoint = 'procesos/';
    const promise = this.api.get(endpoint);
    return from(promise);
  }

  getProceso(id: number): Observable<Proceso> {
    const promise = this.api.get(`procesos/${id}`);
    return from(promise);
  }

  createProceso(proceso: Proceso): Observable<Proceso> {
    const promise = this.api.post('procesos/', proceso);
    return from(promise);
  }

  updateProceso(id: number, proceso: Proceso): Observable<Proceso> {
    const promise = this.api.put(`procesos/${id}`, proceso);
    return from(promise);
  }

  deleteProceso(id: number): Observable<any> {
    const promise = this.api.delete(`procesos/${id}`);
    return from(promise);
  }
}