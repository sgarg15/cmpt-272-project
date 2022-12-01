import { Component, OnInit } from '@angular/core';
import { PigReportInterface } from '../util/pigReport.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-delete-pig-report',
  templateUrl: './delete-pig-report.component.html',
  styleUrls: ['./delete-pig-report.component.css'],
})
export class DeletePigReportComponent implements OnInit {
  password!: String;
  givenDateString?: string;
  givenDate: Date = new Date();
  pigReport?: PigReportInterface;
  passwordCheck: boolean = false;
  error: boolean = false;

  passwordField: boolean = false;

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

  deletePigReport() {
    this.passwordCheck = false;
    this.pigReport = this.crud.getPigReportByDate(this.givenDate);

    console.log(this.pigReport);

    if (this.pigReport) {
      this.crud.deletePigReport(this.pigReport);
    }

    this.password = '';
    this.router.navigate(['']);
    //TODO: Delete pig report using service
  }

  ngOnInit(): void {
    this.givenDateString = this.ActivatedRoute.snapshot.paramMap.get('date')!;
    this.givenDate = new Date(this.givenDateString);
  }
}
