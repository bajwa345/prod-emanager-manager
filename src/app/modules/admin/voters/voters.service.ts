import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";
import { ReturnDataModel, DdObjectDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class VotersService {

    constructor(private http: HttpClient) {}

    getListData(queryData: any): Observable<ReturnDataModel> {
        return this.http.put<ReturnDataModel>(
        backEndUrl  + '/voters/list-voters', queryData
        );
    }

    getFamilyVotersDataByCnic(queryData: any): Observable<ReturnDataModel> {
        return this.http.put<ReturnDataModel>(
        backEndUrl  + '/voters/list-family-voters', queryData
        );
    }

    getVoterAddressBlob(cnic: string): Observable<any> {
        return this.http.get<any>(
            backEndUrl  + '/voters/get-voter-address-image/'+cnic
        );
    }

    updateVoterDetails(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/voters/update-voter-details", requestObject
        );
    }

    getVoterBasicDetails(cnic: string): Observable<any> {
        return this.http.get<any>(
            backEndUrl  + '/voters/get-voter-basic-details/'+cnic
        );
    }

    downloadVoterParchi(requestObject: any): Observable<any> {
        const httpOptions = {
            responseType: 'blob' as 'json'
          };
        return this.http.post<any>(
            backEndUrl + "/voters/pdf-voter-parchi", requestObject, httpOptions
        );
    }

    downloadVoterParchiPdfBlob(path: string): Observable<Blob> {
        return this.http.get(path, {responseType: 'blob'});
    }
}
