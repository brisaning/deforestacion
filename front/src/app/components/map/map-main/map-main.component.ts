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
  @Input() polygonCoords: L.LatLngExpression[] = [];

  private map: any;
  private polygonLayer: any;

  constructor() {
    let coords: any = [
    [4.656, -74.115],
    [4.656, -74.100],
    [4.640, -74.100],
    [4.640, -74.115],
    [4.630, -74.145]
  ];
    this.updatePolygon(coords);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.initialCoords,
      zoom: this.initialZoom
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    if (this.polygonCoords.length > 0) {
      this.drawPolygon(this.polygonCoords);
    }
  }

  updatePolygon(cords: any): void {
  this.polygonCoords = cords;
}

  drawPolygon(coords: L.LatLngExpression[]): void {
    if (this.polygonLayer) {
      this.map.removeLayer(this.polygonLayer);
    }

    this.polygonLayer = L.polygon(coords, {
      color: '#ff0000',
      fillOpacity: 0.5
    }).addTo(this.map);

    this.map.fitBounds(this.polygonLayer.getBounds());
  }

}
