import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PigReportListComponent } from './pig-report-list/pig-report-list.component';
import { PigReportComponent } from './pig-report/pig-report.component';
import { PigMapComponent } from './pig-map/pig-map.component';
import { AddPigReportComponent } from './add-pig-report/add-pig-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StatusEditPipe } from './status-edit.pipe';



@NgModule({
  declarations: [
    AppComponent,
    PigReportListComponent,
    PigReportComponent,
    PigMapComponent,
    AddPigReportComponent,
    StatusEditPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [StatusEditPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
