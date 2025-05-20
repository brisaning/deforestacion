import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { ZonaService } from '../../../services/zona.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { Zona } from '../../../models/zona.model';

@Component({
  selector: 'app-map-main',
  imports: [NgFor],
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
  public id: number;
  public zonas: Zona[] = [];

  constructor(
    private zonaService: ZonaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.id = this.route.snapshot.params['mapId'];

    this.zonaService.getZonas().subscribe((response: any) => {
      this.zonas = response;
    });

    if(typeof this.id !== 'undefined' && this.id !== null && !isNaN(this.id)) {
      this.zonaService.getZona(this.id).subscribe((response: any) => {
        let zona = this.extractCoordinatesForLeaflet(response.geom);
        console.log('zona', zona);
        this.updatePolygon(zona);
      });
    }
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
    
    let drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

    let drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        remove: true
      },
      /*draw: {
        polygon: {
          allowIntersection: false,
          showArea: this.showArea,
          //maxArea: this.maxAreaKm2 ? this.maxAreaKm2 * 1000000 : undefined
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false
      }*/
    });
    this.map.addControl(drawControl);
    
    this.map.on('draw:created', (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      const coords = layer.toGeoJSON().geometrycoordinates;
      console.log('Polygon coordinates:', coords);
      this.updatePolygon(layer.toGeoJSON().coordinates);
    });
    

    if (this.polygonCoords.length > 0) {
      this.drawPolygon(this.polygonCoords);
    }
  }

  updatePolygon(coords: any): void {
    if (coords.length > 0) {
      this.drawPolygon(coords);
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

  changeZone(event: any): void {
    if(event.target.value !== null) {
      console.log('Changing zone to:', event.target.value);
      const mapId = event.target.value;
      this.zonaService.getZona(mapId).subscribe((response: any) => {
        let zona = this.extractCoordinatesForLeaflet(response.geom);
        this.updatePolygon(zona);
      });
      this.router.navigate(['/mapas', event.target.value]);
    }
  }

}
