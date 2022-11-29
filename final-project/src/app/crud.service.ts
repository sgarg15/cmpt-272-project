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
      date: new Date(2022, 10, 22, 12, 12, 26),
      foundLocation: {
        name: 'Boulder',
        lat: 40.0149856,
        lng: -105.2705456,
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
        name: 'Metro',
        lat: 40.0149856,
        lng: -105.2705456,
      },
      pigFound: {
        breed: 'Berkshire',
        pid: 1234567890,
      },
      status: 1,
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
}
