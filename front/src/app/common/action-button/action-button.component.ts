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
  constructor(private router: Router){}

  agInit(params: any): void {
    console.log(params.data.id);
    this.data = params;
  }
  refresh(params: any) {
    return true;
  }
  buttonClicked() {
    console.log(this.data.data.id);

    this.router.navigate(['mapas/' + this.data.data.id]);
  }


}
