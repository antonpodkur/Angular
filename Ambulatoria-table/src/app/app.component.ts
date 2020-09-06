import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from '../assets/app/papaparse.min.js';



import names from '../assets/app/names.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'App';

  state: number = 0;
  prices_run:number=0;
  doctors_run: number=0;
  shedule_run: number=0;

  docCounter:number = 0;
  picCounter:number=-1;

  text: string;
  csv: string;
  csvFormatted: any;

  data:any[]=[];
  headers: string[]=[];

  doctors_data: any[]=[];
  doctors_headers: string[]=[];

  shedule_data: any[]=[];
  shedule_headers: string[]=[];

  name: string = "";
  bio: string = "";
  picPath: string;

  picTime: number = 2;
  tableTime: number = 5;
  time: number;


  constructor(private http: HttpClient) {}

  ngAfterViewInit()
  {
    this.Timer();
  }

///////////////// Timer /////////////////

  async delay(ms:number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
  }

  async Timer(){

    if(this.state >2)
    {
       if(this.docCounter< names.length)
       {
          this.setDoctorInfo(names[this.docCounter], names[this.picCounter]);

          this.docCounter++;
          this.picCounter++;
          console.log(this.picPath);
       }
       else if(this.docCounter==names.length){
         this.docCounter=0;
         this.setDoctorInfo(names[this.docCounter], names[this.picCounter]);
         this.docCounter++;
         console.log(this.picPath);
         this.picCounter=0;
       }

    }
    else if(this.state=== 0)
    {
      if(this.prices_run < 2)
      {
        this.readPrices();
        this.prices_run++;
      } 
    }
    else if(this.state === 1)
    {
      if(this.doctors_run < 2)
      {
        this.readDoctorsList();
        this.doctors_run++;
      } 
    }
    else if(this.state === 2)
    {
      if(this.shedule_run < 2)
      {
        this.readShedule();
        this.shedule_run++;
      } 
    }


    if(this.state<3)
    {
      this.time = this.tableTime;
    }
    else
    {
      this.time = this.picTime;
    }
    while(this.time!=0)
    {
      await this.delay(1000);
      this.time--;
    }
    this.state++;
    if(this.state===6)
    {
      this.state=0;
    }

    this.Timer();
  }

///////////////// End timer /////////////////


//////////////// FileReader //////////////////////////
setDoctorInfo(filename: string, picName:string)
{
  var path = '../assets/app/mdinfo/'+filename+'.txt';
  var text="hello;hello";
  this.http.get(path, {responseType: 'text'}).subscribe(data => {this.text=data});
  console.log(this.text);
  if(this.text!=undefined)
  {
    var text_arr = this.text.split(";");
    this.name = text_arr[0];
    this.bio = text_arr[1];
    this.picPath = '../assets/app/img/'+picName+'.jpg';  
  }
  else
  {
    this.name = "Loading";
    this.bio = "Wait please";
    this.picPath = '../assets/app/tmp.jpg';  
  }
  }
  //////////////// End FileReader //////////////////////////


////////////////////// Prices Reader //////////////////////////////

  readPrices()
  {
    var path = '../assets/app/price/prices.csv';
    this.http.get(path, {responseType: 'text'}).subscribe(data => {this.csv = data;});
    console.log(this.csv);
    if(this.csv!= undefined)
    {
      this.csvToArray(this.csv);
      console.log(this.headers);
      console.log();
      console.log(this.data);
    }
  }

  readDoctorsList()
  {
    var path = '../assets/app/price/doctors.csv';
    this.http.get(path, {responseType: 'text'}).subscribe(data => {this.csv = data;});
    console.log(this.csv);
    if(this.csv!= undefined)
    {
      this.csvToArrayDoctors(this.csv);
      console.log(this.doctors_headers);
      console.log();
      console.log(this.doctors_data);
    }
  }

  readShedule()
  {
    var path = '../assets/app/price/shedule.csv';
    this.http.get(path, {responseType: 'text'}).subscribe(data => {this.csv = data;});
    console.log(this.csv);
    if(this.csv!= undefined)
    {
      this.csvToArrayShedule(this.csv);
      console.log(this.shedule_headers);
      console.log();
      console.log(this.shedule_data);
    }
  }

  csvToArray(scv: string)
  {
    var price_data = scv.split(/\r?\n|\r/);
    for(var count=0; count < price_data.length; count++)
    {
      var cell_data = price_data[count].split(",");
      if(count==0)
      {
        this.headers = cell_data;
      }
      else
      {
        this.data.push(cell_data);
      }
    }
  }

  csvToArrayDoctors(scv: string)
  {
    var price_data = scv.split(/\r?\n|\r/);
    for(var count=0; count < price_data.length; count++)
    {
      var cell_data = price_data[count].split(",");
      if(count==0)
      {
        this.doctors_headers = cell_data;
      }
      else
      {
        this.doctors_data.push(cell_data);
      }
    }
  }

  csvToArrayShedule(scv: string)
  {
    var price_data = scv.split(/\r?\n|\r/);
    for(var count=0; count < price_data.length; count++)
    {
      var cell_data = price_data[count].split(",");
      if(count==0)
      {
        this.shedule_headers = cell_data;
      }
      else
      {
        this.shedule_data.push(cell_data);
      }
    }
  }


  
}



  
