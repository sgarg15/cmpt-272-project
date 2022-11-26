import { Time } from '@angular/common';
import { PigLocation } from './location.module';
import { Pig } from './pig.module';
import { Status } from './status.module';

export interface PigReportInterface {
  reporterName: string;
  reporterNumber: number;
  pigFound: Pig;
  foundLocation: PigLocation;
  notes: string;
  date: Date;
  status: Status;
}
