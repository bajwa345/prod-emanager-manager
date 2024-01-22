import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from './../reports.service';

import { DialogNewUpdateTransportDetailsComponent } from "./dialog-new-update-transport-details/dialognewupdatetransportdetails.component";
import { environment } from 'environments/environment';

@Component({
    selector     : 'transport-incharge-report',
    templateUrl  : './transportincharge.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportInchargeReportComponent
{
    isLoading = true;
    data: ReturnDataModel;
    total_vehical_van: number;
    total_vehical_riksha: number;
    total_vehical_car: number;

    storageUrl = environment.storageUrl;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        public reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void
    {
        this.total_vehical_van = 0;
        this.total_vehical_riksha = 0;
        this.total_vehical_car = 0;

        this.reportsService.getTransportInchargeReportData()
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((ret: any) => {
                this.data = ret;
                this.data.items.forEach(item => {
                    this.total_vehical_van += item.vehical_van;
                    this.total_vehical_riksha += item.vehical_riksha;
                    this.total_vehical_car += item.vehical_car;
                });
                this.isLoading = false;
            });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateDetails(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogNewUpdateTransportDetailsComponent,{
            width:"560px", disableClose: false, autoFocus: true,
            data: {
                rowData: rowData,
                eDom: e
            }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });
    }

    downloadReport(e: HTMLElement){
        try {
            this.reportsService.downloadPdfTransportDemand()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                var blob = new Blob([data], {type: 'application/pdf'});
                var downloadURL = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "transportincharge_report.pdf";
                link.click();
              });
        } catch (error) {
            alert('Something went wrong. Please try again');
        }
    }
}
