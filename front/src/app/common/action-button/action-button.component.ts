import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ICellRendererAngularComp } from "ag-grid-angular";


@Component({
  selector: 'app-action-button',
  imports: [],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss'
})
export class ActionButtonComponent implements ICellRendererAngularComp {
  data: any;
  onDelete!: (id: number) => void;
  constructor(private router: Router){}

  agInit(params: any): void {
    console.log(params);
    this.data = params;
    this.onDelete = params.onDelete;
  }
  refresh(params: any) {
    return true;
  }
  getMap() {
    this.router.navigate(['mapas/' + this.data.data.id]);
  }

  buttonDelete() {
    const id: number = parseInt(this.data.data.id);
    this.onDelete(id);
  }


}
