import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
//Third party modules
import { AngularDeviceInformationService } from 'angular-device-information';
//Module
import { AppRoutingModule } from './app-routing.module';
//Component
import { RootComponent } from '../components/canvas/root/root.component';
import { AppComponent } from '../components/index/app/app.component';
import { HeaderComponent } from '../components/canvas/header/header.component';
import { FooterComponent } from '../components/canvas/footer/footer.component';
import { HomeComponent } from '../components/canvas/static/home/home.component';
//Pipes
import { GenericFilterPipe } from '../pipes/generic-filter.pipe';
import { FormatDatePipe } from '../pipes/format-data.pipe';
//Service
import { ConfigService } from '../services/shared_data/config.service';
import { GlobalVariableService } from '../services/shared_data/global-variable.service';
import { CommonFunctionService } from '../services/shared_function/common-function.service';
import { ApiService } from '../services/shared_function/api.service';
//Custom modules
import { CustomAppModule } from '../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module';
 
import {  ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    RootComponent,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GenericFilterPipe,
    FormatDatePipe,
  ],
  imports: [ 
    AppRoutingModule,
    HttpClientModule,
    CustomAppModule,
    BrowserModule, 
    ReactiveFormsModule,
    FormsModule
  ], 
  providers: [
    ConfigService,
    GlobalVariableService,
    CommonFunctionService,
    ApiService,
    AngularDeviceInformationService,
    provideAnimationsAsync() 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private commonFunctionService: CommonFunctionService) {
    // ConfigService provides the public branding locally before any page renders.
    this.commonFunctionService.initPageDefault();
  }
}
