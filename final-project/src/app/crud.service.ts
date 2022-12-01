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
	  console.log('Getting location from server this.locationList', this.locationList);
      this.subject.next(this.locationList);
	  console.log('Getting location from server this.locationList', this.locationList);
    });
  }

  //Convert Server list to PigReportInterface
  convertToPigReportInterface() {
    for (let i = 0; i < this.serverPigReportList.length; i++) {
      console.log(this.serverPigReportList[i]['data']);
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
    console.log('this.pigReportList', this.pigReportList);
  }

  //Get Server List of Pig Reports
  getPigReportsFromServer(index?: number, pigReport?: PigReportInterface) {
    let url = this.apiUrl + '/pigReports/documents/';
    this.pigReportList = [];
    this.http.get(url).subscribe((data) => {
      this.serverPigReportList = data;
      console.log('this.serverPigReportList', this.serverPigReportList);
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
      console.log(
        'this.serverPigReportList Updated: ',
        this.serverPigReportList
      );

      //Update the server pig report list
      this.http
        .put(pigReportURL, {
          key: pid.toString(),
          data: this.serverPigReportList[indexOfPigReport]['data'],
        })
        .subscribe((data) => {
          console.log('Pig Report Updated on Server');
          console.log(data);
          this.getPigReportsFromServer();
        });
    } else {
      this.serverPigReportList.push({
        key: pid.toString(),
        data: [pigReport],
      });
      console.log(
        'this.serverPigReportList Updated with new pid: ',
        this.serverPigReportList
      );

      //Add the pig report to the server pig report list
      this.http
        .post(url, { key: pid.toString(), data: [pigReport] })
        .subscribe((data) => {
          console.log('Pig Report Added to Server');
          console.log(data);
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
        console.log('Pig Report Updated on Server');
        console.log(data);
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
    console.log('UPLOADING this.locationList', this.locationList);
    let url = this.apiUrl + '/locations/documents/locationList/';
    this.http
      .put(url, { key: 'locationList', data: this.locationList })
      .subscribe((data) => {
		this.getLocationsFromServer();	
        console.log('Location List Updated on Server');
        console.log(data);
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
    console.log('New pig report added!');
    console.log(this.pigReportList);
  }

  updatePigReportStatus(pigReport: PigReportInterface) {
    console.log('updatePigReportStatus: ', pigReport);

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
      console.log('report.date.valueOf(): ', new Date(report.date).valueOf());
      console.log('pigReport.date.valueOf(): ', pigReport.date.valueOf());
      return new Date(report.date).valueOf() === pigReport.date.valueOf();
    });

    console.log(' this.serverPigReportList: ', this.serverPigReportList);
    console.log('indexOfPigReport: ', indexOfPigReport);
    console.log('indexOfPigReportStatus: ', indexOfPigReportStatus);

    this.serverPigReportList[indexOfPigReport]['data'].forEach(
      (element, index) => {
        this.serverPigReportList[indexOfPigReport]['data'][index].status =
          pigReport.status;
      }
    );

    this.serverPigReportList[indexOfPigReport]['data'][
      indexOfPigReportStatus
    ].status = pigReport.status;
    console.log('this.serverPigReportList', this.serverPigReportList);

    //Update the server pig report list
    this.updatePigReportServer(indexOfPigReport, pigReport);

    console.log('Pig report status updated!');
    console.log(this.pigReportList);
  }

  deletePigReport(pigReport: PigReportInterface) {
	this.pigReportList.findIndex((report, index) => {
		if (report.date.valueOf() == pigReport.date.valueOf()) {
			this.pigReportList.splice(index, 1);
		}
	});


    //Also update the server pig report list variable
    let pid = pigReport.pigFound.pid;
    let indexOfPigReport = this.checkIfPigReportExists(pid);

    let indexOfPigReportStatus = this.serverPigReportList[indexOfPigReport][
      'data'
    ].findIndex((report) => {
      console.log('report.date.valueOf(): ', new Date(report.date).valueOf());
      console.log('pigReport.date.valueOf(): ', pigReport.date.valueOf());
      return new Date(report.date).valueOf() === pigReport.date.valueOf();
    });

    this.serverPigReportList[indexOfPigReport][
		'data'
	  ].splice(indexOfPigReportStatus, 1);

	 this.decrementMapListNum(pigReport.foundLocation);

    //Update the server pig report list
    this.updatePigReportServer(indexOfPigReport, pigReport);

    console.log('Pig report deleted!');
    console.log(this.pigReportList);
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
    if (
      this.locationList.findIndex(
        (location) => location.name === newLocation.name
      ) === -1
    ) {
      this.locationList.push(newLocation);
      this.updateLocationListServer();
      this.subject.next(this.locationList);
    } else {
      console.log('Location already exists!');
      this.updateMapListNum(newLocation);
    }
  }
  //#endregion

  //Map Functions
  //#region
  getMapList(): Observable<PigLocation[]> {
    return this.subject.asObservable();
  }

  updateMapListNum(location: PigLocation) {
    console.log('updateMapListNum: ', location);
    const index = this.locationList.findIndex((loc) => {
      return loc.name == location.name;
    });

    console.log('index: ', index);

    this.locationList[index].num++;

    console.log('this.locationList: ', this.locationList);

    this.updateLocationListServer();

    this.subject.next(this.locationList);
    console.log(this.locationList);
  }

  decrementMapListNum(location: PigLocation) {
    console.log('decrementMapListNum: ', location);
    const index = this.locationList.findIndex((loc) => {
		console.log('loc.lat: ', loc.lat);
		console.log('location.lat: ', location.lat);
		console.log('loc.lng: ', loc.lng);
		console.log('location.lng: ', location.lng);
      return loc.lat == location.lat && loc.lng == location.lng;
    });

    console.log('index: ', index);

    this.locationList[index].num--;

    console.log('this.locationList: ', this.locationList);
    this.subject.next(this.locationList);

    this.updateLocationListServer();

    console.log(this.locationList);
  }

  //#endregion
}
