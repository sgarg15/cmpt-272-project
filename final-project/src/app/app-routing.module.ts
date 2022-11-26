import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPigReportComponent } from './add-pig-report/add-pig-report.component';
import { PigReportListComponent } from './pig-report-list/pig-report-list.component';

const routes: Routes = [
  { path: '', component: PigReportListComponent },
  { path: 'addPigReport', component: AddPigReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
