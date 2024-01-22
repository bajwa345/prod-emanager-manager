import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from './../reports.service';

import { DialogNewUpdateFoodDetailsComponent } from "./dialog-new-update-food-details/dialognewupdatefooddetails.component";
import { environment } from 'environments/environment';

@Component({
    selector     : 'food-incharge-report',
    templateUrl  : './foodincharge.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodInchargeReportComponent
{
    isLoading = true;
    data: ReturnDataModel;
    total_food_required: number;

    storageUrl = environment.storageUrl;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        private reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void
    {
        this.total_food_required = 0;

        this.reportsService.getFoodInchargeReportData()
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((ret: any) => {
                this.data = ret;
                this.data.items.forEach(item => {
                    this.total_food_required += item.food_required;
                });
                this.isLoading = false;
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateDetails(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogNewUpdateFoodDetailsComponent,{
            width: "560px", disableClose: false, autoFocus: true,
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
            this.reportsService.downloadPdfFoodDemand()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                var blob = new Blob([data], {type: 'application/pdf'});
                var downloadURL = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "foodincharge_report.pdf";
                link.click();
              });
        } catch (error) {
            alert('Something went wrong. Please try again');
        }
    }

}
