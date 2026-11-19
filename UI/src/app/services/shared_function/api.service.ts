import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
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

  /** A bounded, asynchronous enquiry request; never retry email sends automatically. */
  sendWebsiteEmail(payload: unknown): Observable<void> {
    return this.apiCallPOST_Async('/api/WebSiteController/SendEmail', payload).pipe(
      timeout(15000),
      map((response: unknown) => {
        // The current API returns a JSON-encoded string. Accept an object too,
        // but only the explicit success envelope may clear a visitor's form.
        const result = typeof response === 'string' ? JSON.parse(response) : response;
        if (result?.APIResponse?.Message !== '') {
          throw new Error('Enquiry was not confirmed');
        }
      })
    );
  }
}
