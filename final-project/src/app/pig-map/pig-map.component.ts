import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

//Need to add to make leaflet icons work
import { icon, Marker } from 'leaflet';
import { CrudService } from '../crud.service';
import { PigLocation } from '../util/location.module';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-pig-map',
  templateUrl: './pig-map.component.html',
  styleUrls: ['./pig-map.component.css'],
})
export class PigMapComponent implements AfterViewInit {
  private map: any;
  private locations: PigLocation[];

  constructor(private crud: CrudService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [49.1913, -122.849],
      zoom: 10,
    });

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlnaHRsb2NrZXIiLCJhIjoiY2xiMWZ1ZXI5MDR1cjNwcXIxbHp6MW5tMyJ9.5QQ5ZwClAnJ9pC17YtZZ9w',
      {
        maxZoom: 19,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(this.map);
  }

  public addMarkersToMap() {
    if (this.locations != null) {
      this.locations.forEach((location) => {
        if (location.num > 0) {
          this.addMarkerToMap(
            location.lat,
            location.lng,
            location.name,
            location.num
          );
        }
      });
    }
  }

  public addMarkerToMap(lat: number, lng: number, name: string, num?: number) {
    var marker = L.marker([lat, lng]).addTo(this.map);
    marker.bindPopup(`<b>${name}</b><br>${num} pigs reported`).openPopup();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.crud.getMapList().subscribe((data) => {
      this.locations = data;
      this.addMarkersToMap();
    });
  }
}
