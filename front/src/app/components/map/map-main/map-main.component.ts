import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import { ZonaService } from '../../../services/zona.service';

@Component({
  selector: 'app-map-main',
  imports: [],
  templateUrl: './map-main.component.html',
  styleUrl: './map-main.component.scss',
  providers: [ZonaService],
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

  constructor(
    private zonaService: ZonaService
  ) {

    this.zonaService.getZona(10).subscribe((response: any) => {

      console.log(response.geom);

      let zona = this.extractCoordinatesForLeaflet(response.geom);
      console.log(zona);
      this.updatePolygon(zona);
    });
    
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  extractCoordinatesForLeaflet(polygonStr: string): L.LatLngExpression[] {
    const matches = polygonStr.match(/\(\(([^)]+)\)\)/);
    if (!matches) return [];
    
    return matches[1].split(',')
      .map(pair => pair.trim().split(' '))
      .map(([lng, lat]) => [parseFloat(lat), parseFloat(lng)]);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.initialCoords,
      zoom: this.initialZoom
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    if (this.polygonCoords.length > 0) {
      this.drawPolygon(this.polygonCoords);
    }
  }

  updatePolygon(cords: L.LatLngExpression[]): void {
    if (cords.length > 0) {
      this.drawPolygon(cords);
    }
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
