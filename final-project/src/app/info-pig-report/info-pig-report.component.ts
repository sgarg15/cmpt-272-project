import { Component, OnInit } from '@angular/core';
import { PigReportInterface } from '../util/pigReport.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../crud.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Status } from '../util/status.module';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-info-pig-report',
  templateUrl: './info-pig-report.component.html',
  styleUrls: ['./info-pig-report.component.css'],
})
export class InfoPigReportComponent implements OnInit {
  password!: String;
  givenDateString: string;
  givenDate: Date = new Date();
  pigReport: PigReportInterface;
  passwordCheck: boolean = false;
  error: boolean = false;
  form: FormGroup;

  updatedStatus!: string;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private crud: CrudService
  ) {
    let formControl = {
      reporterName: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      reporterPhone: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      pigBreed: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      pigPid: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      locationName: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      locationLat: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      locationLong: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      notes: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      time: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      date: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      status: new FormControl({ value: Status.RETRIEVED, disabled: true }, [
        Validators.required,
      ]),
    };

    this.form = new FormGroup(formControl);
  }

  updateFormWithValues() {
    this.form.patchValue({
      reporterName: this.pigReport.reporterName,
      reporterPhone: this.pigReport.reporterNumber,
      pigBreed: this.pigReport.pigFound.breed,
      pigPid: this.pigReport.pigFound.pid,
      locationName: this.pigReport.foundLocation.name,
      locationLat: this.pigReport.foundLocation.lat,
      locationLong: this.pigReport.foundLocation.lng,
      notes: this.pigReport.notes,
      time: formatDate(this.pigReport.date, 'HH:mm', 'en'),
      date: formatDate(this.pigReport.date, 'yyyy-MM-dd', 'en'),
      status: Status[this.pigReport.status],
    });
  }

  updatePigReportToShow() {
    console.log('givenDate: ' + this.givenDate);
    this.pigReport = this.crud.getPigReportByDate(this.givenDate);
    console.log(this.pigReport);
  }

  ngOnInit(): void {
    this.givenDateString = this.ActivatedRoute.snapshot.paramMap.get('date')!;
    this.givenDate = new Date(this.givenDateString);
    this.updatePigReportToShow();
    this.updateFormWithValues();
  }
}
