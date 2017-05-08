import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './application/AppComponent';
import { routes } from './Routes';
import { DeviceDataCrudTests } from '../../tests/DeviceDataCrudTests';

import { COMPONENTS, SERVICES } from './index';

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes
  ],
  providers: [
    ...SERVICES,
    DeviceDataCrudTests
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
