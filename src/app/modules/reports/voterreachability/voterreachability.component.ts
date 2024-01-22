import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from './../reports.service';

@Component({
    selector     : 'voter-reachability-report',
    templateUrl  : './voterreachability.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoterReachabilityReportComponent
{
    isLoading = true;
    data: ReturnDataModel;
    total_families: number;
    total_voters: number;
    total_callable_voters: number;
    total_localable_voters: number;
    total_callable_families: number;
    total_localable_families: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public _sharedService: SharedService,
        public reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void
    {
        this.total_families = 0;
        this.total_voters = 0;
        this.total_callable_voters = 0;
        this.total_localable_voters = 0;
        this.total_callable_families = 0;
        this.total_localable_families = 0;

        this.reportsService.getVoterReachabilityReportData()
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((ret: any) => {
                this.data = ret;
                this.data.items.forEach(item => {
                    this.total_families += item.families_count;
                    this.total_voters += item.voters_count;
                    this.total_callable_voters += item.callable_voters_count;
                    this.total_localable_voters += item.localable_voters_count;
                    this.total_callable_families += item.callable_families_count;
                    this.total_localable_families += item.localable_families_count;
                });
                this.isLoading = false;
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    printReport(){}
}
