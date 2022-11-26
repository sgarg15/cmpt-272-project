import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PigReportListComponent } from './pig-report-list/pig-report-list.component';

const routes: Routes = [{ path: '', component: PigReportListComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
