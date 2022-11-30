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
  pigReportList: PigReportInterface[] = [
    {
      reporterName: 'John Doe',
      reporterNumber: 1234567890,
      date: new Date(2022, 10, 22, 12, 12, 26),
      foundLocation: {
        name: 'Abbotsford',
        lat: 49.043122,
        lng: -122.308044,
      },
      pigFound: {
        breed: 'Berkshire',
        pid: 1234567890,
      },
      status: 0,
      notes: 'This pig was found in a field.',
    },
    {
      reporterName: 'Goerge Hamilton',
      reporterNumber: 1234567890,
      date: new Date(2022, 11, 28, 17, 12, 26),
      foundLocation: {
        name: 'Vancouver',
        lat: 49.25788,
        lng: -123.119659,
      },
      pigFound: {
        breed: 'Berkshire',
        pid: 1234567890,
      },
      status: 1,
      notes: 'This pig was found in a field.',
    },
  ];

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
  getPigReportsFromServer() {
    let url = this.apiUrl + '/pigReports/documents/';
    this.pigReportList = [];
    this.http.get(url).subscribe((data) => {
      this.serverPigReportList = data;
      console.log('this.serverPigReportList', this.serverPigReportList);
      this.convertToPigReportInterface();
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
  updatePigReportStatusServer(index: number, pigReport: PigReportInterface) {
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
        this.getPigReportsFromServer();
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

    const index = this.pigReportList.findIndex((report) => {
      return report.date.valueOf() === pigReport.date.valueOf();
    });
    this.pigReportList[index].status = pigReport.status;

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

    this.serverPigReportList[indexOfPigReport]['data'][
      indexOfPigReportStatus
    ].status = pigReport.status;
    console.log('this.serverPigReportList', this.serverPigReportList);

    //Update the server pig report list
    this.updatePigReportStatusServer(indexOfPigReport, pigReport);

    console.log('Pig report status updated!');
    console.log(this.pigReportList);
  }

  deletePigReport(pigReport: PigReportInterface) {
    this.pigReportList = this.pigReportList.filter(
      (report) => report !== pigReport
    );
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
    this.locationList.push(newLocation);
    this.subject.next(this.locationList);
    console.log(this.locationList);
  }
  //#endregion

  //Map Functions
  //#region
  getMapList(): Observable<PigLocation[]> {
    return this.subject.asObservable();
  }

  updateMapListNum(location: PigLocation) {
    const index = this.locationList.findIndex((loc) => {
      return loc.name === location.name;
    });
    this.locationList[index].num++;
    console.log(this.locationList);
  }
  //#endregion
}
