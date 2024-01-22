import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";
import { ReturnDataModel, DdObjectDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class ResultCompilationService {

    constructor(private http: HttpClient) {}

    getListData(queryData: any): Observable<ReturnDataModel> {
        return this.http.put<ReturnDataModel>(
        backEndUrl  + '/pollingstations/list-pollingstations', queryData
        );
    }

    getPollingStationDetails(pollingstationid: string): Observable<any> {
        return this.http.get<any>(
            backEndUrl  + '/pollingstations/get-pollingstation-details/'+ pollingstationid
        );
    }

    updatePollingStationDetails(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/pollingstations/update-pollingstation-details", requestObject
        );
    }
}
