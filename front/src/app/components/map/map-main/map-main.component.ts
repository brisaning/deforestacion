import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-main',
  imports: [],
  templateUrl: './map-main.component.html',
  styleUrl: './map-main.component.scss'
})
export class MapMainComponent implements AfterViewInit  {

  @Input() initialCoords: L.LatLngExpression = [4.6, -74.1]; // Centro de Colombia por defecto
  @Input() initialZoom = 6;
  @Input() editable = false;
  @Input() existingPolygon?: L.LatLngExpression[];
  @Input() showArea = true;
  @Input() maxAreaKm2?: number;
  
  private map: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: this.initialCoords,
      zoom: this.initialZoom,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
