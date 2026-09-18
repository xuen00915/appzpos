import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CommonFunctionService } from './common-function.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private commonFunctionService: CommonFunctionService
  ) { }

  //POST method asynchronous call
  apiCallPOST_Async(strAPIURL: string, objParamData: any = null, objHeaderData: any = {}, objOptions: any = {}): Observable<any> {
    //Headers
    var objHeader: any = {};
    objHeader["Content-Type"] = "application/json";
    for (var key in objHeaderData) {
      if (key == "Authorization") {
        objHeader[key] = "Bearer " + objHeaderData[key];
      }
      else {
        objHeader[key] = objHeaderData[key];
      }
    }
    const requestHeader = new HttpHeaders(objHeader);
    //Body
    const requestBody = objParamData;
    //Call API
    const cstOptions = { headers: requestHeader };
    const cstAPIURL = this.commonFunctionService.BindURL_API(strAPIURL);
    return this.http.post(cstAPIURL, requestBody, cstOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(() => error);
      })
    )
  }

  //POST method synchronous call
  apiCallPOST_Sync(strAPIURL: string, objParamData: any = null, objHeaderData: any = {}, objOptions: any = {}): Promise<any> {
    const cstAPIURL = this.commonFunctionService.BindURL_API(strAPIURL);
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', cstAPIURL, false);
      //Header
      xhr.setRequestHeader('Content-Type', 'application/json');
      for (var key in objHeaderData) {
        if (key == "Authorization") {
          xhr.setRequestHeader(key, "Bearer " + objHeaderData[key]);
        }
        else {
          xhr.setRequestHeader(key, objHeaderData[key]);
        }
      }
      //Body
      const requestBody = JSON.stringify(objParamData);
      //Set up event listeners
      xhr.onload = () => {
        if (xhr.status === 200) {
          // The request was successful
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          // Handle errors
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => {
        // Handle network errors
        reject('Network error');
      };
      //Send the request synchronously
      xhr.send(requestBody);
    });
  }
}
