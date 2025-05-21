import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { ZonaService } from '../../../services/zona.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Zona } from '../../../models/zona.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartamentoService } from '../../../services/departamento.service';
import { ProcesoService } from '../../../services/proceso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-map-main',
  imports: [NgFor, NgIf, ReactiveFormsModule],
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
  public form: any;
  public isDisabled: boolean = true;

  public departamentos: any[] = [];
  public procesos: any[] = [];
  
  constructor(
    private zonaService: ZonaService,
    private departamentoService: DepartamentoService,
    private procesoService: ProcesoService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.id = this.route.snapshot.params['mapId'];
    
    this.zonaService.getZonas().subscribe((response: any) => {
      this.zonas = response;
    });

    this.initForm();
    
    if(typeof this.id !== 'undefined' && this.id !== null && !isNaN(this.id)) {
      this.zonaService.getZona(this.id).subscribe((response: any) => {
        let zona = this.extractCoordinatesForLeaflet(response.geom);
        this.form.controls['nombre_zona'].setValue(response.nombre_zona);
        this.form.controls['tipo_proceso'].setValue(response.tipo_proceso);
        this.form.controls['departamento'].setValue(response.departamento);
        this.form.controls['geom'].setValue(response.geom);
        console.log(response.nombre_zona);
        this.updatePolygon(zona);
      });
    }

    this.departamentoService.getDepartamentos().subscribe((response: any) => {
      this.departamentos = response;
    });

    this.procesoService.getProcesos().subscribe((response: any) => {
      this.procesos = response;
    });
  }
  
  ngAfterViewInit(): void {
    this.initMap();
  }
  
  initForm(){
    this.form = this.formBuilder.group({
      nombre_zona: ["", [Validators.required]],
      tipo_proceso: ["", [Validators.required]],
      departamento: ["", [Validators.required]],
      geom: ["", [Validators.required]]
    });
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
      draw: {
        polygon: {
          allowIntersection: false,
          //showArea: this.showArea,
          //maxArea: this.maxAreaKm2 ? this.maxAreaKm2 * 1000000 : undefined
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false
      },
      position: 'topright'
    });
    this.map.addControl(drawControl);
    
    this.map.on('draw:created', (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      this.drawEditPolygon(layer);
      this.isDisabled = false;
    });
    
    this.map.on('draw:edited', (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: any) => {
        this.drawEditPolygon(layer);
      });
      this.isDisabled = false;
    });

    if (this.polygonCoords.length > 0) {
      this.drawPolygon(this.polygonCoords);
    }
  }

  arrayToWKTPolygon(coords: [number, number][]): string {
    if (coords.length === 0) return "POLYGON EMPTY";

    // Asegurarse de que el polígono esté cerrado (primera y última coordenada iguales)
    const firstCoord = coords[0];
    const lastCoord = coords[coords.length - 1];
    const closedCoords = [...coords];

    if (firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1]) {
      closedCoords.push(firstCoord); // Cierra el polígono si no está cerrado
    }

    // Formatear las coordenadas como "lon lat, lon lat, ..."
    const coordString = closedCoords
      .map(([lon, lat]) => `${lon} ${lat}`)
      .join(", ");

    return `POLYGON((${coordString}))`;
  }

  drawEditPolygon(layer: any) {
    const geoJSONFeature = layer.toGeoJSON();
      const coordinates = geoJSONFeature.geometry.coordinates[0]; // Obtener el anillo exterior
      console.log(coordinates);
      const latLngs = coordinates.map((coord: any) => L.latLng(coord[1], coord[0])); // Invertir a [lat, lng]
      this.updatePolygon(latLngs);
      
      let polistring = this.arrayToWKTPolygon(coordinates);
      console.log(polistring);
      this.form.controls['geom'].setValue(polistring);
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
    if(event.target.value !== null && !isNaN(event.target.value)) {
      console.log('Changing zone to:', event.target.value);
      const mapId = event.target.value;
      this.zonaService.getZona(mapId).subscribe((response: any) => {
        let zona = this.extractCoordinatesForLeaflet(response.geom);
        this.form.controls['nombre_zona'].setValue(response.nombre_zona);
        this.form.controls['tipo_proceso'].setValue(response.tipo_proceso);
        this.form.controls['departamento'].setValue(response.departamento);
        this.form.controls['geom'].setValue(response.geom);
        this.updatePolygon(zona);
      });
      this.id = event.target.value
      this.router.navigate(['/mapas', event.target.value]);
    }
  }

  onSubmit(): void {
    let params = {
      nombre_zona: this.form.value.nombre_zona,
      tipo_proceso: this.form.value.tipo_proceso,
      departamento: this.form.value.departamento,
      geom: this.form.value.geom
    };

    if(this.id !== null && this.id !== undefined && !isNaN(this.id)) {
      this.zonaService.updateZona(this.id, params).subscribe((response: any) => {
        Swal.fire({
          title: 'Correcto!',
          text: 'El Registro se actualizó correctamente',
          icon: 'success',
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {  location.reload(); }, 2000);
      } );
    } else{
      this.zonaService.createZona(params).subscribe((response: any) => {
        Swal.fire({
          title: 'Correcto!',
          text: 'El Registro se creo correctamente',
          icon: 'success',
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 2000,
        });
       setTimeout(() => {  location.reload(); }, 2000);
  
      });
    }
  }

  onDelete(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.zonaService.deleteZona(this.id).subscribe((response: any) => {
          Swal.fire({
            title: 'Correcto!',
            text: 'El Registro se eliminó correctamente',
            icon: 'success',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2000,
          });
          this.router.navigate(['/zonas']);
        });
      }
    });
  }

  onInfo(): void {
    Swal.fire({
      title: 'Información',
      text: 'Debe elegir la herramienta de dibujo para crear o actulizar un polígono. Luego, haga clic en el botón para "Guardar" para que el campo "Polígono" contenga datos o los actualice.',
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar'
    });
  }
  
}
