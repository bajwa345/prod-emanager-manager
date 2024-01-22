import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from './../reports.service';

@Component({
    selector     : 'polling-scheme-report',
    templateUrl  : './pollingscheme.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollingSchemeReportComponent
{
    public filePath: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        private reportsService: ReportsService) {}

    ngOnInit(): void
    {
        this.filePath = "assets/files/PP-158.pdf";
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
