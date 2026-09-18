import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {

  //Initialize shared data object
  objSharedData: any = {
    PageVariables: {
      
    }
  };

  constructor() { }
}
