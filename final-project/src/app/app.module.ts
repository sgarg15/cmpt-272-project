import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PigReportListComponent } from './pig-report-list/pig-report-list.component';
import { PigReportComponent } from './pig-report/pig-report.component';
import { PigMapComponent } from './pig-map/pig-map.component';

@NgModule({
  declarations: [
    AppComponent,
    PigReportListComponent,
    PigReportComponent,
    PigMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
