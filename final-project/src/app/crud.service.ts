import { Injectable } from '@angular/core';
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
      date: new Date('2021-01-01'),
      foundLocation: {
        name: 'Boulder',
        lat: 40.0149856,
        lng: -105.2705456,
      },
      pigFound: {
        breed: 'Berkshire',
        pid: 1234567890,
      },
      status: Status.READYFORPICKUP,
      notes: 'This pig was found in a field.',
    },
  ];

  constructor() {}

  getPigReportList() {
    return this.pigReportList;
  }

  addPigReport(pigReport: PigReportInterface) {
    this.pigReportList.push(pigReport);
    console.log('New pig report added!');
    console.log(this.pigReportList);
  }

  deletePigReport(pigReport: PigReportInterface) {
    this.pigReportList = this.pigReportList.filter(
      (report) => report !== pigReport
    );
    console.log('Pig report deleted!');
    console.log(this.pigReportList);
  }
}
