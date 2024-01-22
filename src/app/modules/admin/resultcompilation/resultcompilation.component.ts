import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ResultCompilationService } from './resultcompilation.service';

import { DialogNewResultDetailsComponent } from "./dialog-new-result-details/dialognewresultdetails.component";
import { DialogUpdateResultDetailsComponent } from "./dialog-update-result-details/dialogupdateresultdetails.component";

@Component({
    selector     : 'result-compilation',
    templateUrl  : './resultcompilation.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultCompilationComponent
{
    user: User;

    //constituency: string = "NA 78 Narowal";
    contestors: any = [
        {
            id    : 4,
            cn_id : 3,
            name  : 'شفقت محمود',
            votes : 101501,
            party : 'pti',
            symbol: 'bat'
        },
        {
            id    : 12,
            cn_id : 0,
            name  : 'چوہدری احسن اقبال',
            votes : 98456,
            party : 'pmln',
            symbol: 'tiger'
        },
        {
            id    : 12,
            cn_id : 0,
            name  : 'فردوس احمد نیازی',
            votes : 68456,
            party : 'azaad',
            symbol: 'jeep'
        },
        {
            id    : 28,
            cn_id : 0,
            name  : 'محمد علی عباس',
            votes : 38456,
            party : 'azaad',
            symbol: 'cycle'
        },
        {
            id    : 29,
            cn_id : 0,
            name  : 'خواجہ احمد رفیق',
            votes : 8456,
            party : 'mqm',
            symbol: 'kite'
        }
    ];
    electoralAreas: any = [
        {
            id    : 12,
            name  : 'چونگی امرسدھو نارووال',
            totalPS : 18,
            processedPS : 17
        },
        {
            id    : 14,
            name  : 'یو سی رئیہ خاص نارووال',
            totalPS : 14,
            processedPS : 14
        },
        {
            id    : 14,
            name  : 'یو سی اسلام پورہ سٹی نارووال',
            totalPS : 9,
            processedPS : 7
        },
        {
            id    : 12,
            name  : 'یو سی شاہ غریب نارووال',
            totalPS : 13,
            processedPS : 12
        },
        {
            id    : 28,
            name  : 'یوسی ڈومالہ نارووال',
            totalPS : 15,
            processedPS : 12
        },
        {
            id    : 13,
            name  : 'یو سی رحمان پورہ سٹی ظفروال',
            totalPS : 12,
            processedPS : 12
        },
        {
            id    : 29,
            name  : 'یو سی سنکھترہ نارووال',
            totalPS : 5,
            processedPS : 4
        },
        {
            id    : 39,
            name  : 'یو سی شاہ پور اڈہ نارووال',
            totalPS : 11,
            processedPS : 11
        },
        {
            id    : 18,
            name  : 'یو سی فیروز پور نارووال',
            totalPS : 9,
            processedPS : 8
        },
        {
            id    : 12,
            name  : 'یو سی دھمتھل سٹی ظفروال',
            totalPS : 10,
            processedPS : 10
        },
        {
            id    : 14,
            name  : 'یو سی علی پور سیداں نارووال',
            totalPS : 14,
            processedPS : 13
        },
        {
            id    : 14,
            name  : 'یو سی رائیہ خاص نارووال',
            totalPS : 14,
            processedPS : 3
        }
    ];
    pollingStationResults: any = [
        {
            id   : 12,
            name : 'گورنمنٹ سر سید ہائی سکول چاندنی چوک ظفروال',
            increase : 108,
            position : 2
        },
        {
            id    : 28,
            name  : 'گورنمنٹ گرلز ایلیمنٹری ہائی سکول شاہ پور ظفروال',
            increase : 140,
            position : 3
        },
        {
            id   : 14,
            name : 'گورنمنٹ گرلز ایلیمنٹری ہائی سکول چونگی روڈ نارووال',
            increase : 302,
            position : 1
        },
        {
            id   : 12,
            name : 'گورنمنٹ مسلم خواتین ایلیمنٹری سکول والٹن نارووال',
            increase : 532,
            position : 1
        },
        {
            id    : 28,
            name  : 'گورنمنٹ مسلم گرلز ہائی سکول مین بازار ریلوے روڈ نارووال',
            increase : 214,
            position : 5
        },
        {
            id    : 29,
            name  : 'گورنمنٹ گرلز ایلیمنٹری ہائی سکول نارووال',
            increase : 123,
            position : 1
        },
        {
            id    : 28,
            name  : 'گورنمنٹ گرلز ہائی سکول دھمتھل ظفروال',
            increase : 110,
            position : 5
        },
        {
            id    : 39,
            name  : 'گورنمنٹ ایلیمنٹری ہائی سکول بھڈا پنڈ نارووال',
            increase : 312,
            position : 1
        },
        {
            id    : 18,
            name  : 'گورنمنٹ مردانہ ایلیمنٹری ہائی سکول غازی روڈ نارووال',
            increase : 90,
            position : 3
        },
        {
            id    : 13,
            name  : 'گورنمنٹ شفیع محمد ہائی سکول ظفروال',
            increase : 32,
            position : 4
        },
        {
            id    : 12,
            name  : 'گورنمنٹ ایلیمنٹری ہائی سکول بہلول پور نارووال',
            increase : 532,
            position : 2
        },
        {
            id    : 28,
            name  : 'گورنمنٹ سر سید ہائی سکول چاندنی چوک ظفروال',
            increase : 15,
            position : 5
        },
    ];
    resultPercentage: number = 85;
    totalPollingStations: number = 345;
    processedPollingStations: number = 294;
    voteLead: number = 3045;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        private _userService: UserService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void
    {
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    newResultDetails(rowData: any,  e: HTMLElement){
        /*this._blockCodesService.getBlockCodeDetails(rowData.vtr_blockCode)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.item != null) {
                    this.dialog.open(DialogViewBlockCodeDetailsComponent,{
                        width:"40%", disableClose: false, autoFocus: true,
                        data: {
                          rowData: res.item
                        }
                    });
                }
            });*/
        const dialogRef = this.dialog.open(DialogNewResultDetailsComponent,{
            width:"40%", disableClose: false, autoFocus: true,
            data: {
              rowData: rowData
            }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });
    }

    updateResultDetails(rowData: any,  e: HTMLElement){
        /*const dialogRef;
        this._blockCodesService.getBlockCodeDetails(rowData.vtr_blockCode)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(res => {
            if(res.item != null) {
                dialogRef = this.dialog.open(DialogViewBlockCodeDetailsComponent,{
                    width:"40%", disableClose: false, autoFocus: true,
                    data: {
                      rowData: res.item
                    }
                });
            }
        });
        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });*/
    }
}
