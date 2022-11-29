import { Injectable } from '@angular/core';
import { PigLocation } from './util/location.module';
import { PigReportInterface } from './util/pigReport.module';
import { Status } from './util/status.module';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
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

  locationList: PigLocation[] = [
    {
      name: 'Abbotsford',
      lat: 49.043122,
      lng: -122.308044,
    },
    {
      name: 'Vancouver',
      lat: 49.25788,
      lng: -123.119659,
    },
    {
      name: 'Langley',
      lat: 49.099823,
      lng: -122.66922,
    },
    {
      name: 'Surrey',
      lat: 49.187025,
      lng: -122.842255,
    },
  ];

  mapList: any[] = [
    {
      name: 'Abbotsford',
      lat: 49.043122,
      lng: -122.308044,
      num: 1,
    },
    {
      name: 'Vancouver',
      lat: 49.25788,
      lng: -123.119659,
      num: 1,
    },
  ];

  constructor() {}

  //Pig Report Functions
  getPigReportList() {
    return this.pigReportList;
  }

  addPigReport(pigReport: PigReportInterface) {
    this.pigReportList.push(pigReport);
    console.log('New pig report added!');
    console.log(this.pigReportList);
  }

  updatePigReportStatus(pigReport: PigReportInterface) {
    const index = this.pigReportList.findIndex((report) => {
      return report.date.valueOf() === pigReport.date.valueOf();
    });
    this.pigReportList[index].status = pigReport.status;
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

  //Location Functions
  getLocationList(): PigLocation[] {
    return this.locationList;
  }

  addLocationList(newLocation: PigLocation) {
    this.locationList.push(newLocation);
    console.log(this.locationList);
  }

  //Map Functions
  getMapList(): any[] {
    return this.mapList;
  }
}
