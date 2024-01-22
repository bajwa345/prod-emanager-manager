import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";
import { ReturnDataModel, DdObjectDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class PollingAgentsService {

    constructor(private http: HttpClient) {}

    getListData(queryData: any): Observable<ReturnDataModel> {
        return this.http.put<ReturnDataModel>(
        backEndUrl  + '/pollingagents/list-pollingagents', queryData
        );
    }

    getVoterBasicDetails(requestObject: any) : Observable<any> {
        return this.http.post<ReturnDataModel>(
            backEndUrl  + '/pollingagents/get-voter-name-and-status', requestObject
        );
    }

    getPollingAgentsList(pollingstationid: string): Observable<any> {
        return this.http.get<any>(
        backEndUrl  + '/pollingagents/get-pollingagents-list/'+ pollingstationid
        );
    }

    updatePollingAgents(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/pollingagents/update-pollingagents", requestObject
        );
    }
}
