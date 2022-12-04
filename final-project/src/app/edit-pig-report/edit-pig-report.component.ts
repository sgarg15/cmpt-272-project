import { Component, OnInit } from '@angular/core';
import { PigReportInterface } from '../util/pigReport.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../crud.service';
import { Status } from '../util/status.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    private router: Router,
    private http: HttpClient
  ) {}

  togglePasswordVisibility() {
    this.passwordField = !this.passwordField;
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

  verifyPassword() {
    this.http
      .get('https://api.hashify.net/hash/md5/hex?value=' + this.password)
      .subscribe((data: any) => {
        console.log(data.Digest);
        if (data.Digest === '84892b91ef3bf9d216bbc6e88d74a77c') {
          this.passwordCheck = !this.passwordCheck;
        } else {
          if (!this.error) {
            this.error = !this.error;
          }
        }
      });
  }

  ngOnInit(): void {
    this.givenDateString = this.ActivatedRoute.snapshot.paramMap.get('date')!;
    this.givenDate = new Date(this.givenDateString);
  }
}
