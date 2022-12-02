import { Component, OnInit } from '@angular/core';
import { PigReportInterface } from '../util/pigReport.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../crud.service';
import { Status } from '../util/status.module';

@Component({
  selector: 'app-edit-pig-report',
  templateUrl: './edit-pig-report.component.html',
  styleUrls: ['./edit-pig-report.component.css'],
})
export class EditPigReportComponent implements OnInit {
  password!: String;
  givenDateString?: string;
  givenDate: Date = new Date();
  pigReport?: PigReportInterface;
  passwordCheck: boolean = false;
  error: boolean = false;

  passwordField: boolean = false;

  updatedStatus!: string;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private crud: CrudService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.passwordField = !this.passwordField;
  }

  checkPassword() {
    console.log(this.password);
    if (this.password === 'OINK!!') {
      this.passwordCheck = !this.passwordCheck;
    } else {
      if (!this.error) {
        this.error = !this.error;
      }
    }
  }

  updateStatus() {
    this.pigReport = this.crud.getPigReportByDate(this.givenDate);
    console.log('this.pigReport in edit ', this.pigReport);
    if (this.pigReport) {
      if (this.updatedStatus === '0') {
        this.pigReport.status = Status.READYFORPICKUP;
      } else {
        this.pigReport.status = Status.RETRIEVED;
      }
      this.crud.updatePigReportStatus(this.pigReport);
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.givenDateString = this.ActivatedRoute.snapshot.paramMap.get('date')!;
    this.givenDate = new Date(this.givenDateString);
  }
}
