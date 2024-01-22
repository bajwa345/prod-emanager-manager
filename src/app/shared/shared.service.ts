import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SortDirection } from "@angular/material/sort";

import { environment } from '../../environments/environment';
const backEndUrl = environment.apiUrl;


export interface ReturnDataModel {
    type: string;
    message: string;
    item: any;
    items: any[];
    rows_count: number;
}

export interface DdObjectDataModel {
    id: number;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class SharedService {

    constructor(private http: HttpClient) {}


    getPaConstituenciesDD(): Observable<{ddlist : any[]}> {
        return this.http.get<{ddlist : any[]}>(backEndUrl  + '/utils/dd-paconstituencies');
        /*.pipe(
            tap((response: any) => {
                this._data.next(response.ddlist);
            }));*/
    }

    getUcConstituenciesDD(paId: string): Observable<{ddlist : any[]}> {
        const queryData:any = {
            ipaconstituency: paId
        }
        return this.http.put<{ddlist : any[]}>(backEndUrl  + '/utils/dd-ucconstituencies', queryData);
        /*.pipe(
            tap((response: any) => {
                this._data.next(response.ddlist);
            }));*/
    }

    getPollingLocationsDD(paId: string, ucId: string = null): Observable<{ddlist : any[]}> {
        const queryData:any = {
            ipaconstituency: paId,
            iucconstituency: ucId
        }
        return this.http.put<{ddlist : any[]}>(backEndUrl  + '/utils/dd-pollinglocations', queryData);
        /*.pipe(
            tap((response: any) => {
                this._data.next(response.ddlist);
            }));*/
    }

    getPollingStationsDD(paId: string, ucId: string, plId: string = null): Observable<{ddlist : any[]}> {
        const queryData:any = {
            ipaconstituency: paId,
            iucconstituency: ucId,
            ipollinglocation: plId
        }
        return this.http.put<{ddlist : any[]}>(backEndUrl  + '/utils/dd-pollingstations', queryData);
        /*.pipe(
            tap((response: any) => {
                this._data.next(response.ddlist);
            }));*/
    }

    getElectoralAreasDD(paId: string, ucId: string, plId: string = null, psId: string = null): Observable<{ddlist : any[]}> {
        const queryData:any = {
            ipaconstituency: paId,
            iucconstituency: ucId,
            ipollinglocationid: plId,
            ipollingstationid: psId
        }
        return this.http.put<{ddlist : any[]}>(backEndUrl  + '/utils/dd-electoralareas', queryData);
        /*.pipe(
            tap((response: any) => {
                this._data.next(response.ddlist);
            }));*/
    }

    getBlockCodesDD(paId: string, ucId: string, plcId: string): Observable<{ddlist : any[]}> {
        const queryData:any = {
            ipaconstituency: paId,
            iucconstituency: ucId,
            ipollinglocationid: plcId
        }
        return this.http.put<{ddlist : any[]}>(backEndUrl  + '/utils/dd-blockcodes', queryData);
        /*.pipe(
            tap((response: any) => {
                this._data.next(response.ddlist);
            }));*/
    }

    getAppUsersDD(): Observable<{ddlist : any[]}> {
        return this.http.put<{ddlist : any[]}>(backEndUrl  + '/utils/dd-appusers', null);
        /*.pipe(
            tap((response: any) => {
                this._data.next(response.ddlist);
            }));*/
    }

    formatCnic(str: string){
        if(!str) return '';
        else if(str.length != 13) return str;
        else return str.substring(0, 5) + '-' + str.substring(5, 12) + '-' + str.substring(12);
    }

    formatMobile(str: string){
        if(!str || str == 'null'|| str == '0') return '';
        else if(str.length == 10 && str.substring(0, 1) != '0') return '0' + str.substring(0, 3) + '-' + str.substring(3);
        else if(str.length == 11 && str.substring(0, 1) == '0') return str.substring(0, 4) + '-' + str.substring(4);
        else return str;
    }

    isUrduString(str: string){
        var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
        var result = pattern.test(str);
        return result;
    }

    isEnglishString(str: string){
        var pattern = /^[,.\-_;:() A-Za-z0-9]*$/;
        var result = pattern.test(str);
        return result;
    }

    getUniqueId(parts: number): string {
        const stringArr = [];
        for(let i = 0; i< parts; i++){
          const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
          stringArr.push(S4);
        }
        return stringArr.join('-');
    }

    addLeadingZeros(num: number, totalLength: number): string {
        return String(num).padStart(totalLength, '0');
    }
}
