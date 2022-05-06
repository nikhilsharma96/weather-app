import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService implements OnInit {

  private lattitude: number= 0;
  private longitude: number= 0;
  private key: string = "c219ff87dfa36f41bbc242384b139dbc";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }


  public getCurrentData(longitude: number, lattitude: number): Observable<any> {
    console.log(lattitude,longitude)
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=${this.key}`);
  }

  public getFutureWeatherForecast(longitude: number, latitude: number): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=726d57e64566684e6692164d8d8f3515`)
  }
}
