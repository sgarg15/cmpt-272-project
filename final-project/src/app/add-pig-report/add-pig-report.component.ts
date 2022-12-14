import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../crud.service';
import { StatusEditPipe } from '../status-edit.pipe';
import { PigReportInterface } from '../util/pigReport.module';

@Component({
  selector: 'app-add-pig-report',
  templateUrl: './add-pig-report.component.html',
  styleUrls: ['./add-pig-report.component.css'],
})
export class AddPigReportComponent implements OnInit {
  form: FormGroup;
  locations: any[];
  placeHolderName = 'Enter your name';

  constructor(
    private router: Router,
    private statusEdit: StatusEditPipe,
    private crud: CrudService
  ) {
    let formControl = {
      reporterName: new FormControl(null, [Validators.required]),
      reporterPhone: new FormControl(null, [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      pigBreed: new FormControl(null, [Validators.required]),
      pigPid: new FormControl(null, [Validators.required]),
      locationSetter: new FormControl('Other', [Validators.required]),
      locationName: new FormControl(null, [Validators.required]),
      locationLat: new FormControl(null, [
        Validators.required,
        this.latitudeValidator.bind(this),
      ]),
      locationLong: new FormControl(null, [
        Validators.required,
        this.longitudeValidator.bind(this),
      ]),
      notes: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
    };

    this.form = new FormGroup(formControl);
  }

  usedNameValidator(control: FormControl) {
    if (control.value != null) {
      for (let i = 0; i < this.locations.length; i++) {
        if (this.locations[i].name === control.value) {
          return { usedNameError: true };
        }
      }
    }
    return null;
  }

  latitudeValidator(control: FormControl) {
    if (control.value != null) {
      if (control.value < -90 || control.value > 90) {
        return { latitudeError: true };
      }
    }
    return null;
  }

  longitudeValidator(control: FormControl) {
    if (control.value != null) {
      if (control.value < -180 || control.value > 180) {
        return { longitudeError: true };
      }
    }
    return null;
  }

  enableLocation() {
    this.form.controls['locationName'].enable();
    this.form.controls['locationLat'].enable();
    this.form.controls['locationLong'].enable();
  }

  disableLocation() {
    this.form.controls['locationName'].disable();
    this.form.controls['locationLat'].disable();
    this.form.controls['locationLong'].disable();
  }

  toggleNewLocation() {
    if (this.form.value.locationSetter === 'Other') {
      this.enableLocation();
      this.form.controls['locationName'].setValidators([
        Validators.required,
        this.usedNameValidator.bind(this),
      ]);
      this.form.controls['locationName'].setValue(null);
      this.form.controls['locationLat'].setValue(null);
      this.form.controls['locationLong'].setValue(null);
    } else {
      //Later change dependend on locationSetter
      let selectedLocation = this.form.controls['locationSetter'].value;
      this.form.controls['locationName'].setValidators([Validators.required]);
      //Loop through locations and find the selected location
      for (let i = 0; i < this.locations.length; i++) {
        if (this.locations[i].name === selectedLocation) {
          this.form.controls['locationName'].setValue(this.locations[i].name);
          this.form.controls['locationLat'].setValue(this.locations[i].lat);
          this.form.controls['locationLong'].setValue(this.locations[i].lng);

          this.disableLocation();
        }
      }
    }
  }

  updateLocationList() {
    this.locations = this.crud.getLocationList();
  }

  onSubmit(values: any) {
    let currentSeconds = new Date().getSeconds();
    //Create a new report object
    var date: Date = new Date(
      values.date.split('-')[0],
      values.date.split('-')[1] - 1,
      values.date.split('-')[2],
      values.time.split(':')[0],
      values.time.split(':')[1],
      currentSeconds
    );

    var newPigReport: PigReportInterface = {
      reporterName: values.reporterName,
      reporterNumber: values.reporterPhone,
      pigFound: {
        breed: values.pigBreed,
        pid: values.pigPid,
      },
      foundLocation: {
        name: this.form.controls['locationName'].value,
        lat: this.form.controls['locationLat'].value,
        lng: this.form.controls['locationLong'].value,
        num: 0,
      },
      notes: values.notes,
      date: date,
      status: 0,
    };

    if (this.form.controls['locationSetter'].value === 'Other') {
      this.crud.addLocationList(newPigReport.foundLocation);
    } else {
      this.crud.updateMapListNum(newPigReport.foundLocation);
    }

    //Add the new report to the list
    this.crud.addPigReport(newPigReport);

    // navigation back to root
    this.form.reset();
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.updateLocationList();
    this.form.controls['locationName'].setValidators([
      Validators.required,
      this.usedNameValidator.bind(this),
    ]);
  }
}
