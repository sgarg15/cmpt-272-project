import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-pig-report',
  templateUrl: './add-pig-report.component.html',
  styleUrls: ['./add-pig-report.component.css'],
})
export class AddPigReportComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router) {
    let formControl = {
      reporterName: new FormControl(null, [Validators.required]),
      reporterPhone: new FormControl(null, [Validators.required]),
      pigBreed: new FormControl(null, [Validators.required]),
      pigPid: new FormControl(null, [Validators.required]),
      locationSetter: new FormControl(null, [Validators.required]),
      locationName: new FormControl(null, [Validators.required]),
      locationLat: new FormControl(null, [Validators.required]),
      locationLong: new FormControl(null, [Validators.required]),
      notes: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
    };

    this.form = new FormGroup(formControl);
  }

  toggleNewLocation() {
    if (this.form.value.locationSetter === 'Other') {
      this.form.controls['locationName'].setValue(null);
      this.form.controls['locationLat'].setValue(null);
      this.form.controls['locationLong'].setValue(null);
    } else {
      //Later change dependend on locationSetter

      this.form.controls['locationName'].setValue('MetroTown');
      this.form.controls['locationLat'].setValue(12414);
      this.form.controls['locationLong'].setValue(12414);
    }
  }

  onSubmit(values: any) {
    console.log(values);
    // add this pigReport

    // navigation back to root
    this.form.reset();
    this.router.navigate(['']);
  }

  ngOnInit(): void {}
}