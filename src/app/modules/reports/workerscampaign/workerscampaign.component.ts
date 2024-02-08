import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { ReportsService } from '../reports.service';

@Component({
    selector     : 'workers-campaign-report',
    templateUrl  : './workerscampaign.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WorkersCampaignReportComponent implements OnInit, AfterViewInit, OnDestroy {
    startDate = new FormControl(null, null);
    endDate = new FormControl(null, null);

    stats: any;
    total_did_searches: number;
    total_updated_phones: number;
    total_updated_locations: number;
    total_sent_sms: number;
    total_nonvoter_requests: number;

    displayedColumns: string[] = ['rownumber', 'aur_userName', 'aur_fullName', 'aur_signUpTime', 'did_searches', 'updated_phones', 'updated_locations', 'nonvoter_requests'];
    resultsLength = 0;
    isLoading = false;

    ddAppUsers: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    public dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(public _sharedService: SharedService,
        public reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void
    {
        this.total_did_searches = 0;
        this.total_updated_phones = 0;
        this.total_updated_locations = 0;
        this.total_sent_sms = 0;
        this.total_nonvoter_requests = 0;
    }

    ngAfterViewInit(): void
    {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.populateListData();
        this.cdRef.detectChanges();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    search(){
        this.populateListData();
    }

    clear(){
        this.startDate.setValue('');
        this.endDate.setValue('');

        this.populateListData();
    }

    populateListData(){
        merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            startWith({}),
            switchMap((searchTerm) => {
              this.isLoading = true;
  
              const queryData: any = {
                  istartdate: this.startDate.value,
                  ienddate: this.endDate.value,
  
                  fromRow: (this.paginator.pageIndex * 25) + 1,
                  toRow: (this.paginator.pageIndex + 1) * 25,
                  sortColumn: this.sort.active,
                  sortOrder: this.sort.direction,
                  search: ''//(searchTerm && typeof searchTerm == 'string') ? searchTerm.toString() : ''
              }
              return this.reportsService.getWorkersCampaignSummaryReportData(queryData)
                .pipe(catchError(() => of(null)));
            }),
            map(data => {
              if (data === null || data.rows_count == 0) {
                this.resultsLength = 0;
                this.dataSource.data = [];
              }
              else {
                this.resultsLength = data.rows_count;
                this.dataSource.data = data.items;
              }
              this.total_did_searches = data.stats.total_did_searches;
              this.total_updated_phones = data.stats.total_updated_phones;
              this.total_updated_locations = data.stats.total_updated_locations;
              this.total_sent_sms = data.stats.total_sent_sms;
              this.total_nonvoter_requests = data.stats.total_nonvoter_requests;
              
              this.isLoading = false;
              this.cdRef.detectChanges();
  
              return data;
            })
          ).subscribe(data => {
              this._unsubscribeAll.next(data);
          });
    }
  
    printReport(){}
}
