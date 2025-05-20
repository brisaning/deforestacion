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
    let coords: any = [
    [4.656, -74.115],
    [4.656, -74.100],
    [4.640, -74.100],
    [4.640, -74.115],
    [4.630, -74.145]
  ];

  console.log(coords);
  
  

  this.zonaService.getZona(1).subscribe((zona: any) => {
    let zonacambiada = this.extractCoordinatesForLeaflet(zona.geom);
    
    console.log(zonacambiada);
    this.updatePolygon(zonacambiada);
    });
    
  }

  extractCoordinatesForLeaflet(polygonStr: string): L.LatLngExpression[] {
    const matches = polygonStr.match(/\(\(([^)]+)\)\)/);
    if (!matches) return [];
    
    return matches[1].split(',')
      .map(pair => pair.trim().split(' '))
      .map(([lng, lat]) => [parseFloat(lat), parseFloat(lng)]);
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
