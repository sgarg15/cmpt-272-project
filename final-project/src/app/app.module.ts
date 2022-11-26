import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PigReportListComponent } from './pig-report-list/pig-report-list.component';
import { PigReportComponent } from './pig-report/pig-report.component';

@NgModule({
  declarations: [
    AppComponent,
    PigReportListComponent,
    PigReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
