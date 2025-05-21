import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { from, Observable } from 'rxjs';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  constructor(private api: ApiService) {}

  getDepartamentos(): Observable<Departamento[]> {
    let endpoint = 'departamentos/';
    const promise = this.api.get(endpoint);
    return from(promise);
  }

  getDepartamento(id: number): Observable<Departamento> {
    const promise = this.api.get(`departamentos/${id}`);
    return from(promise);
  }

  createDepartamento(departamento: Departamento): Observable<Departamento> {
    const promise = this.api.post('departamentos/', departamento);
    return from(promise);
  }

  updateDepartamento(id: number, departamento: Departamento): Observable<Departamento> {
    const promise = this.api.put(`departamentos/${id}`, departamento);
    return from(promise);
  }

  deleteDepartamento(id: number): Observable<any> {
    const promise = this.api.delete(`departamentos/${id}`);
    return from(promise);
  }
}