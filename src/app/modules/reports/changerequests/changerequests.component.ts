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
import { DialogNewChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-new-changerequest/dialognewchangerequest.component';
import { DialogViewChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-view-changerequest/dialogviewchangerequest.component';
import { DialogUpdateChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-update-changerequest/dialogupdatechangerequest.component';
import { DialogProgressChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-progress-changerequest/dialogprogresschangerequest.component';
import { DialogDeleteChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-delete-changerequest/dialogdeletechangerequest.component';


@Component({
    selector       : 'change-requests-report',
    templateUrl    : './changerequests.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeRequestsReportComponent implements OnInit, AfterViewInit, OnDestroy {

    startDate = new FormControl(null, null);
    endDate = new FormControl(null, null);
    appUser = new FormControl(null, null);
    name = new FormControl(null, null);
    cnicNumber = new FormControl(null, null);
    mobileNumber = new FormControl(null, null);
    requestType = new FormControl(null, null);
    requestStatus = new FormControl(null, null);

    //displayedColumns: string[] = ['rownumber', 'nvr_requestType', 'nvr_name', 'nvr_mobile', 'nvr_cnic', 'nvr_reportTime', 'nvr_status', 'actions'];
    displayedColumns: string[] = ['rownumber', 'nvr_requestType', 'nvr_name', 'nvr_mobile', 'nvr_reportTime', 'nvr_status', 'actions'];
    resultsLength = 0;
    isLoading = false;

    ddAppUsers: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    public dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(public _sharedService: SharedService,
        private reportsService: ReportsService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this.populateAppUsersDD();
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

    populateAppUsersDD(){
        this._sharedService.getAppUsersDD()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.ddAppUsers = res.ddlist;
            });
    }

    search(){
        this.populateListData();
    }

    clear(){
        this.startDate.setValue('');
        this.endDate.setValue('');
        this.appUser.setValue('');
        this.name = new FormControl(null, null);
        this.cnicNumber = new FormControl(null, null);
        this.mobileNumber = new FormControl(null, null);
        this.requestType.setValue('');
        this.requestStatus.setValue('');

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
                iuserid: this.appUser.value,
                iname: this.name.value,
                icnic: this.cnicNumber.value,
                imobile: this.mobileNumber.value,
                irequesttype: this.requestType.value,
                istatus: this.requestStatus.value,

                fromRow: (this.paginator.pageIndex * 25) + 1,
                toRow: (this.paginator.pageIndex + 1) * 25,
                sortColumn: this.sort.active,
                sortOrder: this.sort.direction,
                search: ''//(searchTerm && typeof searchTerm == 'string') ? searchTerm.toString() : ''
            }
            return this.reportsService!.getChangeRequestsReportData(queryData)
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
            this.isLoading = false;
            this.cdRef.detectChanges();
            
            return data;
          })
        ).subscribe(data => {
            this._unsubscribeAll.next(data);
        });
    }

    viewDetails(rowData: any,  e: HTMLElement){
        this.dialog.open(DialogViewChangeRequestComponent,{
          width:"720px", disableClose: false, autoFocus: true, 
          data: {
            rowData: rowData,
            eDom: e
          }
        });
    }

    updateDetails(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogUpdateChangeRequestComponent, {
          width: "500px", disableClose: false, autoFocus: true, 
          data: {
            rowData: rowData,
            eDom: e
          }
        });

        dialogRef.afterClosed().subscribe(()=>{
            //this.cdRef.detectChanges();
            this.populateListData();
        });
    }

    progress(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogProgressChangeRequestComponent, {
          width: "500px", disableClose: false, autoFocus: true, 
          data: {
            rowData: rowData,
            eDom: e
          }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });
    }

    deleteRequest(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogDeleteChangeRequestComponent, {
          width: "500px", disableClose: false, autoFocus: true, 
          data: {
            rowData: rowData,
            eDom: e
          }
        });

        dialogRef.afterClosed().subscribe(()=>{
            //this.cdRef.detectChanges();
            this.populateListData();
        });
    }

    newRequest(){
        const dialogRef = this.dialog.open(DialogNewChangeRequestComponent, {
          width: "500px", disableClose: false, autoFocus: true 
        });

        dialogRef.afterClosed().subscribe(()=>{
            //this.cdRef.detectChanges();
            this.populateListData();
        });
    }
}
