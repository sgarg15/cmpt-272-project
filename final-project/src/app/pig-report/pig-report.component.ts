import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PigReportInterface } from '../util/pigReport.module';

@Component({
  selector: '[app-pig-report]',
  templateUrl: './pig-report.component.html',
  styleUrls: ['./pig-report.component.css'],
})
export class PigReportComponent implements OnInit {
  @Input()
  pigReport!: PigReportInterface;
  @Output() delete = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
