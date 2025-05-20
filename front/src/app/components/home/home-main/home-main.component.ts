import { Component } from '@angular/core';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { ZonaService } from '../../../services/zona.service';
import { Zona } from '../../../models/zona.model';
import { ActionButtonComponent } from '../../../common/action-button/action-button.component';

ModuleRegistry.registerModules([AllCommunityModule]);
  

@Component({
  selector: 'app-home-main',
  imports: [AgGridAngular],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.scss'
})
export class HomeMainComponent {

  public rowData: Zona[] = [];

  constructor(
    private zonaService: ZonaService,
  ) {
    this.zonaService.getZonas().subscribe((response: Zona[]) => {
      this.rowData = response;
    });
  }

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<any>[] = [
    { headerName: "Nombre Zona", field: "nombre_zona" },
    { headerName: "Departamento", field: "departamento" },
    { headerName: "Tipo Proceso", field: "tipo_proceso" },
    { headerName: "Geometría",  field: "geom" },
    { field: "Acciones", cellRenderer: ActionButtonComponent, 
      cellRendererParams: {
        idModal: 'deleteModal'
      } 
 }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
}
