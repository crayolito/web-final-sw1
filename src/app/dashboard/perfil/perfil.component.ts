import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import mapboxgl, { LngLat, Map, Marker } from 'mapbox-gl';
mapboxgl.accessToken =
  'pk.eyJ1Ijoic2N1bXBpaSIsImEiOiJjbHhsbjFycm8wMjBoMmpwd3NvenpnMmgxIn0.sO-6U8_MXbVYmwWquibutA';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export default class PerfilComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('map') divMap!: ElementRef;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(
    -63.18215133936172,
    -17.783253855301936
  );
  ngOnInit(): void {}
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: this.currentLngLat,
      zoom: 17,
    });
    this.myLocation();
  }

  myLocation() {
    if (!this.map) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const lngLat = new LngLat(
        position.coords.longitude,
        position.coords.latitude
      );
      this.marcadorMiUbicacion(lngLat);
      this.map?.flyTo({
        zoom: 15.5,
        center: lngLat,
      });
    });
  }

  marcadorMiUbicacion(lngLat: LngLat): Marker {
    var el;
    el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(assets/marcador-de-posicion.png)';
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.backgroundSize = 'cover';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.filter = 'drop-shadow(0 5px 5px rgba(0, 0, 0, 0.5))';

    return new Marker(el).setLngLat(lngLat).addTo(this.map!);
  }
}
