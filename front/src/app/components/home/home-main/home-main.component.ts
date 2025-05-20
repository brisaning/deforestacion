import { Component } from '@angular/core';
  import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-home-main',
  imports: [AgGridAngular],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.scss'
})
export class HomeMainComponent {

  rowData = [
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ];

    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" }
    ];
}
