import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subject, BehaviorSubject, combineLatest, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { PoliticalWorkersService } from './politicalworkers.service';
import { DialogUpdatePoliticalWorkerDetailsComponent } from './dialog-update-politicalworker-details/dialogupdatepoliticalworkerdetails.component';
import { DialogNewPoliticalWorkerDetailsComponent } from './dialog-new-politicalworker-details/dialognewpoliticalworkerdetails.component';


@Component({
    selector       : 'list-politicalworkers',
    templateUrl    : './listpoliticalworkers.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPoliticalWorkersComponent implements OnInit, AfterViewInit, OnDestroy {

    workers: any = [];

    paConstituency = new FormControl(null, null);
    pollingLocation = new FormControl(null, null);
    electoralArea = new FormControl(null, null);
    cnicNumber = new FormControl(null, null);
    mobileNumber = new FormControl(null, null);
    name = new FormControl(null, null);
    userStatus = new FormControl(null, null);

    resultsLength = 0;
    isLoading = true;

    ddPaConstituencies: any[] = null;
    ddPollingLocations: any[] = null;
    ddElectoralAreas: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private politicalWorkersService: PoliticalWorkersService,
        private _sharedService: SharedService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this.populatePaConstituenciesDD();
        this.populatePollingLocationsDD();
        this.populateElectoralAreasDD();
    }

    ngAfterViewInit(): void
    {
        this.paginator.pageIndex = 0;
        this.paginator.page.subscribe(
            (event) => { this.populateListData(); }
        );

        this.populateListData();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    populatePaConstituenciesDD(){
        this._sharedService.getPaConstituenciesDD()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddPaConstituencies = res.ddlist
            );
    }

    populatePollingLocationsDD(){
        this._sharedService.getPollingLocationsDD(this.paConstituency.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.ddPollingLocations = res.ddlist,
                this.pollingLocation.setValue('');
            });
    }

    populateElectoralAreasDD(){
        this._sharedService.getElectoralAreasDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddElectoralAreas = res.ddlist
            );
    }


    search(){
        this.paginator.firstPage();
        this.populateListData();
    }

    clear(){
        this.paConstituency.setValue('');
        this.pollingLocation.setValue('');
        this.electoralArea.setValue('');
        this.cnicNumber = new FormControl(null, null);
        this.mobileNumber = new FormControl(null, null);
        this.name = new FormControl(null, null);
        this.userStatus.setValue('');

        this.paginator.firstPage();
        this.populateListData();
    }

    populateListData(){
        this.isLoading = true;

        const queryData: any = {
            ipaconstituency: this.paConstituency.value,
            ipollinglocationid: this.pollingLocation.value,
            ielectoralareaid: this.electoralArea.value,
            icnic: this.cnicNumber.value,
            imobile: this.mobileNumber.value,
            iname: this.name.value,
            iuserstatus: this.userStatus.value,

            fromRow: (this.paginator.pageIndex * 12) + 1,
            toRow: (this.paginator.pageIndex + 1) * 12,
            sortColumn: 'plw_id',
            sortOrder: 'asc',
            search: ''
        };
        this.politicalWorkersService!.getListData(queryData)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.isLoading = false;
                this.resultsLength = data.rows_count;
                this.workers = data.items;
                this.cdRef.detectChanges();
        });
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    newDetails(){
        const dialogRef = this.dialog.open(DialogNewPoliticalWorkerDetailsComponent,{
          width:"540px", disableClose: false, autoFocus: true //40%
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });
    }

    updateDetails(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogUpdatePoliticalWorkerDetailsComponent,{
          width: "540px", disableClose: false, autoFocus: true, //40%
          data: {
            rowData: rowData,
            eDom: e
          }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.populateListData(); //this.cdRef.detectChanges();
        });
    }
}
