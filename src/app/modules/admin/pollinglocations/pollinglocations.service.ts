import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";
import { ReturnDataModel, DdObjectDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class PollingLocationsService {

    constructor(private http: HttpClient) {}

    getListHeadersData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
            backEndUrl  + '/pollinglocations/list-pollinglocation-heads'
        );
    }

    getPollingLocationDetails(pollinglocationid: number): Observable<any> {
        return this.http.get<any>(
            backEndUrl  + '/pollinglocations/get-pollinglocation-details/'+ pollinglocationid
        );
    }

    updatePollingLocationDetails(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/pollinglocations/update-pollinglocation-details", requestObject
        );
    }
}
