import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  //Initialize config data object
  objConfigData: any = {};

  constructor() { }
}
