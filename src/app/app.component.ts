import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers

})
export class AppComponent implements OnInit {
  
  public backgroundImage = "../assets/images/cloud-blue-sky.jpg";
  public currentData:any;
  public image: any;
  public temperature: string= "";
  public lattitude: number= 0;
  public longitude: number= 0;
  public placeDetails: any;
  public sunrise: any;
  public sunset: any;
  public lastUpdate: any;
  public futureData: any;
  private weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  public hourlyData: any;
  private lastIndex: number=0;
  private prevIndex: number=0;
  public hourly: any;

  constructor(private service: CommonService, config: NgbCarouselConfig){
    config.interval = 200000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  ngOnInit(): void {
    if (navigator.geolocation) {
      const self = this;
      navigator.geolocation.getCurrentPosition(function(location) {
        self.lattitude = location.coords.latitude;
        self.longitude = location.coords.longitude;
        self.callApi();
      });
    }
  }

  callApi(){
    this.service.getCurrentData(this.longitude,this.lattitude)
    .subscribe(data => {
      console.log(data); this.currentData = data;
      this.image= "http://openweathermap.org/img/w/" + this.currentData.weather[0].icon + ".png";
      this.temperature = parseFloat(""+(this.currentData.main.temp-273.15)).toFixed(2);
      this.sunrise = this.changeTimeStamp(data.sys.sunrise);
      this.sunset = this.changeTimeStamp(data.sys.sunset);
      this.lastUpdate =  this.changeTimeStamp(data.dt);
      if(new Date(data.dt)>new Date(this.sunrise)){
        this.backgroundImage= "../assets/images/cloud-blue-sky.jpg";
      }
      else{
        this.backgroundImage= "../assets/images/night-sky.jpg";
      }
    });
    this.service.getFutureWeatherForecast(this.longitude,this.lattitude)
    .subscribe((data) => {
      this.futureData =  data.daily;
      this.futureData = [...this.futureData?.slice(1)];
      this.hourlyData =  data.hourly;
      this.hourly = [...this.hourlyData.slice(1,8)];
      this.lastIndex= 8;
      this.prevIndex=0;
    })
  }

  changeTimeStamp(timestamp: number){
    var date = new Date(timestamp * 1000);
    var hours:any = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var time = hours + ":" + minutes + " " + am_pm;
    return time;
  }

  getDay(timestamp: number){
    var date = new Date(timestamp * 1000);
    return this.weekday[date.getDay()]+", "+date.getDate();
  }

  getDate(timestamp: number){
    var date = new Date(timestamp * 1000);
    return date.getDate();
  }

  imageUrl(image: string){
    return "http://openweathermap.org/img/w/" + image+ ".png";
  }

  nextData(){
    if(this.lastIndex<47){  
      this.hourly.shift();
      this.hourly = [...this.hourly,this.hourlyData[this.lastIndex+1]]
      this.lastIndex++;
      this.prevIndex++;
    }
  }

  previousData(){
    if(this.prevIndex>=0){  
      this.hourly.pop();
      this.hourly = [this.hourlyData[this.prevIndex], ...this.hourly];
      this.prevIndex--;
      this.lastIndex--;
    }
  }
}
