import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import GoogleApiKey from "../../app/GoogleMapsApiKey";

@Injectable()
export class MapsProvider {

  //Google maps API key
  private API_KEY: string = GoogleApiKey;

  constructor(public http: HttpClient) {}

  /**
   * Get the JSON-endpoint form Google Maps API from the given coordinates
   * @param {number} lat latitude
   * @param {number} lng longitude
   * @returns {Observable<Object>} Observable JSON-Object containing the data
   */
  public getLocation(lat: number, lng: number): Observable<Object> {

    //concatenating the url
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.API_KEY}`;
    return this.http.get(url);
  }

}
