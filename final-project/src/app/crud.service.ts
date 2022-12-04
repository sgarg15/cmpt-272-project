import { Injectable } from '@angular/core';
import { PigLocation } from './util/location.module';
import { PigReportInterface } from './util/pigReport.module';
import { Status } from './util/status.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  apiUrl: string = 'https://272.selfip.net/apps/RIrQxXAkvT/collections';
  pigReportList: PigReportInterface[] = [];

  serverPigReportList: any;

  locationList: PigLocation[];

  private subject: BehaviorSubject<PigLocation[]>;

  constructor(private http: HttpClient) {
    this.subject = new BehaviorSubject(this.locationList);

    this.getLocationsFromServer();
    this.getPigReportsFromServer();
  }

  //Database Functions
  //#region
  //Get Locations list from server
  getLocationsFromServer() {
    let url = this.apiUrl + '/locations/documents/';
    this.http.get(url).subscribe((data) => {
      let locations = data[0]['data'];
      this.locationList = locations;
	  
      this.subject.next(this.locationList);
	  
    });
  }

  //Convert Server list to PigReportInterface
  convertToPigReportInterface() {
    for (let i = 0; i < this.serverPigReportList.length; i++) {
      
      let data = this.serverPigReportList[i]['data'];
      data.forEach((element) => {
        let newPigReport: PigReportInterface = {
          reporterName: element.reporterName,
          reporterNumber: element.reporterNumber,
          date: new Date(element.date),
          foundLocation: element.foundLocation,
          pigFound: element.pigFound,
          status: element.status,
          notes: element.notes,
        };
        this.pigReportList.push(newPigReport);
      });
    }
    
  }

  //Get Server List of Pig Reports
  getPigReportsFromServer(index?: number, pigReport?: PigReportInterface) {
    let url = this.apiUrl + '/pigReports/documents/';
    this.pigReportList = [];
    this.http.get(url).subscribe((data) => {
      this.serverPigReportList = data;
      
      this.convertToPigReportInterface();

	  if (index != undefined && pigReport != undefined) {
		if(data[index]['data'].length == 0){
			this.deletePigReportFromServer(pigReport);
		}
	  }
    });
  }

  //Check if server list contains pig pid
  checkIfPigReportExists(pid: number): number {
    for (let i = 0; i < this.serverPigReportList.length; i++) {
      if (this.serverPigReportList[i]['key'] == pid) {
        return i;
      }
    }
    return -1;
  }

  //Add Pig Report to Server
  addPigReportToServer(pigReport: PigReportInterface) {
    let pid = pigReport.pigFound.pid;
    let url = this.apiUrl + '/pigReports/documents/';
    let pigReportURL = this.apiUrl + `/pigReports/documents/${pid}/`;
    let indexOfPigReport = this.checkIfPigReportExists(pid);
    if (indexOfPigReport != -1) {
      //Add the pig report to the server pig report list
      this.serverPigReportList[indexOfPigReport]['data'].push(pigReport);

      //Update the server pig report list
      this.http
        .put(pigReportURL, {
          key: pid.toString(),
          data: this.serverPigReportList[indexOfPigReport]['data'],
        })
        .subscribe((data) => {
          
          
          this.getPigReportsFromServer();
        });
    } else {
      this.serverPigReportList.push({
        key: pid.toString(),
        data: [pigReport],
      });

      //Add the pig report to the server pig report list
      this.http
        .post(url, { key: pid.toString(), data: [pigReport] })
        .subscribe((data) => {
          
          
          this.getPigReportsFromServer();
        });
    }
  }

  //Update Pig Report Status
  updatePigReportServer(index: number, pigReport: PigReportInterface) {
    let pid = pigReport.pigFound.pid;
    let pigReportURL = this.apiUrl + `/pigReports/documents/${pid}/`;

    //Update the server pig report list
    this.http
      .put(pigReportURL, {
        key: pid.toString(),
        data: this.serverPigReportList[index]['data'],
      })
      .subscribe((data) => {
        
        
        this.getPigReportsFromServer(index, pigReport);


      });
  }

  //Delete Pig Report from Server
  deletePigReportFromServer(pigReport: PigReportInterface) {
    let pid = pigReport.pigFound.pid;
    let pigReportURL = this.apiUrl + `/pigReports/documents/${pid}/`;

    //Update the server pig report list
    this.http.delete(pigReportURL).subscribe((data) => {
      this.getPigReportsFromServer();
    });
  }

  //Update Location Information
  updateLocationListServer() {
    
    let url = this.apiUrl + '/locations/documents/locationList/';
    this.http
      .put(url, { key: 'locationList', data: this.locationList })
      .subscribe((data) => {
		this.getLocationsFromServer();	
        
        
      });
  }
  //#endregion

  //Pig Report Functions
  //#region
  getPigReportList() {
    return this.pigReportList;
  }

  addPigReport(pigReport: PigReportInterface) {
    this.pigReportList.push(pigReport);
    this.addPigReportToServer(pigReport);
    
    
  }

  updatePigReportStatus(pigReport: PigReportInterface) {
    

    this.pigReportList.forEach((element, index) => {
      if (element.pigFound.pid == pigReport.pigFound.pid) {
        this.pigReportList[index].status = pigReport.status;
      }
    });

    //Also update the server pig report list variable
    let pid = pigReport.pigFound.pid;
    let indexOfPigReport = this.checkIfPigReportExists(pid);

    let indexOfPigReportStatus = this.serverPigReportList[indexOfPigReport][
      'data'
    ].findIndex((report) => {
      
      
      return new Date(report.date).valueOf() === pigReport.date.valueOf();
    });

    
    
    

    this.serverPigReportList[indexOfPigReport]['data'].forEach(
      (element, index) => {
        this.serverPigReportList[indexOfPigReport]['data'][index].status =
          pigReport.status;
      }
    );

    this.serverPigReportList[indexOfPigReport]['data'][
      indexOfPigReportStatus
    ].status = pigReport.status;
    

    //Update the server pig report list
    this.updatePigReportServer(indexOfPigReport, pigReport);

    
    
  }

  deletePigReport(pigReport: PigReportInterface) {
	

  for (const [index, report] of this.pigReportList.entries()) {
    if (new Date(report.date).valueOf() == pigReport.date.valueOf()) {
      this.pigReportList.splice(index, 1);
      break;
    }
  }


    //Also update the server pig report list variable
    let pid = pigReport.pigFound.pid;
    let indexOfPigReport = this.checkIfPigReportExists(pid);

    let indexOfPigReportStatus = this.serverPigReportList[indexOfPigReport][
      'data'
    ].findIndex((report) => {
      
      
      return new Date(report.date).valueOf() === pigReport.date.valueOf();
    });

    this.serverPigReportList[indexOfPigReport][
		'data'
	  ].splice(indexOfPigReportStatus, 1);

	 this.decrementMapListNum(pigReport.foundLocation);

    //Update the server pig report list
    this.updatePigReportServer(indexOfPigReport, pigReport);

    
    
  }

  getPigReportByDate(date: Date): PigReportInterface | undefined {
    return this.pigReportList.find((report) => {
      return report.date.valueOf() === date.valueOf();
    });
  }
  //#endregion

  //Location Functions
  //#region
  getLocationList(): PigLocation[] {
    return this.locationList;
  }

  addLocationList(newLocation: PigLocation) {
    
    newLocation.num++;
    this.locationList.push(newLocation);
    this.updateLocationListServer();
    this.subject.next(this.locationList);
  }
  //#endregion

  //Map Functions
  //#region
  getMapList(): Observable<PigLocation[]> {
    return this.subject.asObservable();
  }

  updateMapListNum(location: PigLocation) {
    
    const index = this.locationList.findIndex((loc) => {
      return loc.name == location.name;
    });

    

    this.locationList[index].num++;

    

    this.updateLocationListServer();

    this.subject.next(this.locationList);
    
  }

  decrementMapListNum(location: PigLocation) {
    
    const index = this.locationList.findIndex((loc) => {
		
		
		
		
      return loc.lat == location.lat && loc.lng == location.lng;
    });

    

    this.locationList[index].num--;

    
    this.subject.next(this.locationList);

    this.updateLocationListServer();

    
  }

  //#endregion
}
