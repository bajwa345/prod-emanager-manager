import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";
import { ReturnDataModel, DdObjectDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class ReportsService {

    constructor(private http: HttpClient) {}

    //food incharge report
    getFoodInchargeReportData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
        backEndUrl  + '/reports/report-foodincharge'
        );
    }

    updateFoodDemand(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/reports/update-food-demand", requestObject
        );
    }

    downloadPdfFoodDemand(): Observable<any> {
        const httpOptions = {
            responseType: 'blob' as 'json'
          };
        return this.http.get<any>(
            backEndUrl + "/reports/pdf-foodincharge", httpOptions
        );
    }

    //transport incharge
    getTransportInchargeReportData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
        backEndUrl  + '/reports/report-transportincharge'
        );
    }

    updateTransportDemand(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/reports/update-transport-demand", requestObject
        );
    }

    downloadPdfTransportDemand(): Observable<any> {
        const httpOptions = {
            responseType: 'blob' as 'json'
          };
        return this.http.get<any>(
            backEndUrl + "/reports/pdf-transportincharge", httpOptions
        );
    }

    //voter reachability report
    getVoterReachabilityReportData(): Observable<ReturnDataModel> {
        return this.http.get<ReturnDataModel>(
        backEndUrl  + '/reports/report-voterreachability'
        );
    }

    //workers campaign report
    getWorkersCampaignSummaryReportData(queryData: any): Observable<ReturnDataModel> {
        return this.http.put<ReturnDataModel>(
        backEndUrl  + '/reports/report-workerscampaignsummary', queryData
        );
    }

    //change requests
    getChangeRequestsReportData(queryData: any): Observable<ReturnDataModel> {
        return this.http.put<ReturnDataModel>(
        backEndUrl  + '/changerequests/list-changerequests', queryData
        );
    }

    newChangeRequest(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/changerequests/new-changerequest", requestObject
        );
    }

    updateChangeRequest(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/changerequests/update-changerequest", requestObject
        );
    }

    progressChangeRequest(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/changerequests/progress-changerequest", requestObject
        );
    }

    deleteChangeRequest(requestObject: any): Observable<ReturnDataModel> {
        return this.http.post<ReturnDataModel>(
            backEndUrl + "/changerequests/delete-changerequest", requestObject
        );
    }
}
