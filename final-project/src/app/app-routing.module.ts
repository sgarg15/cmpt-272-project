import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPigReportComponent } from './add-pig-report/add-pig-report.component';
import { DeletePigReportComponent } from './delete-pig-report/delete-pig-report.component';
import { EditPigReportComponent } from './info-pig-report/edit-pig-report.component';
import { PigReportListComponent } from './pig-report-list/pig-report-list.component';

const routes: Routes = [
  { path: '', component: PigReportListComponent },
  { path: 'addPigReport', component: AddPigReportComponent },
  { path: 'deletePigReport/:date', component: DeletePigReportComponent },
  { path: 'editPigReport/:date', component: EditPigReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
