import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';
import { PigReportInterface } from '../util/pigReport.module';
import { Status } from '../util/status.module';

@Component({
  selector: 'app-pig-report-list',
  templateUrl: './pig-report-list.component.html',
  styleUrls: ['./pig-report-list.component.css'],
})
export class PigReportListComponent implements OnInit {
  pigReportList: PigReportInterface[] = [];
  private sortLocation = true;
  private sortReportedBy = true;
  private sortTime = true;
  private sortStatus = true;

  constructor(private crud: CrudService) {}

  sortByLocation() {
    console.log('sorting by location');
    this.sortLocation = !this.sortLocation;
    if (this.sortLocation) {
      this.pigReportList.sort((a, b) =>
        a.foundLocation.name > b.foundLocation.name ? 1 : -1
      );
    } else {
      this.pigReportList.sort((a, b) =>
        a.foundLocation.name < b.foundLocation.name ? 1 : -1
      );
    }
  }

  sortByReportedBy() {
    console.log('sorting by reported by');
    this.sortReportedBy = !this.sortReportedBy;
    if (this.sortReportedBy) {
      this.pigReportList.sort((a, b) =>
        a.reporterName > b.reporterName ? 1 : -1
      );
    } else {
      this.pigReportList.sort((a, b) =>
        a.reporterName < b.reporterName ? 1 : -1
      );
    }
  }

  sortByTime() {
    console.log('sorting by time');
    this.sortTime = !this.sortTime;
    if (this.sortTime) {
      this.pigReportList.sort((a, b) => (a.date > b.date ? 1 : -1));
    } else {
      this.pigReportList.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
  }

  sortByStatus() {
    console.log('sorting by status');
    this.sortStatus = !this.sortStatus;
    if (this.sortStatus) {
      this.pigReportList.sort((a, b) => (a.status > b.status ? 1 : -1));
    } else {
      this.pigReportList.sort((a, b) => (a.status < b.status ? 1 : -1));
    }
  }

  ngOnInit(): void {
    this.pigReportList = this.crud.getPigReportList();
  }
}
