import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PigReportInterface } from '../util/pigReport.module';

@Component({
  selector: '[app-pig-report]',
  templateUrl: './pig-report.component.html',
  styleUrls: ['./pig-report.component.css'],
})
export class PigReportComponent implements OnInit {
  @Input()
  pigReport!: PigReportInterface;

  constructor(private router: Router) {}

  onDelete(evt: any, date: Date) {
    this.router.navigate(['/deletePigReport', date.toJSON()]);
  }

  onInfo(evt: any, date: Date) {
    this.router.navigate(['/info', date.toJSON()]);
  }

  editStatus(evt: any, date: Date) {
    this.router.navigate(['/editPigReport', date.toJSON()]);
  }

  ngOnInit(): void {}
}
