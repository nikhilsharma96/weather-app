import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-image',
  templateUrl: './background-image.component.html',
  styleUrls: ['./background-image.component.css']
})
export class BackgroundImageComponent implements OnInit {

  @Input() backgroundImage: any;
  public data= "cloud-blue-sky.jpg";
  constructor() { }

  ngOnInit(): void {
  }

}
