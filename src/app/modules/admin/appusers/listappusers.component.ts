import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { AppUsersService } from './appusers.service';
import { DialogNewAppUserComponent } from 'app/modules/admin/appusers/dialog-new-appuser/dialognewappuser.component';
import { DialogViewAppUserDetailsComponent } from 'app/modules/admin/appusers/dialog-view-appuser-details/dialogviewappuserdetails.component';
import { DialogUpdateAppUserDetailsComponent } from 'app/modules/admin/appusers/dialog-update-appuser-details/dialogupdateappuserdetails.component';
import { DialogResetAppUserPasswordComponent } from 'app/modules/admin/appusers/dialog-reset-appuser-password/dialogresetappuserpassword.component';
import { DialogDeleteAppUserComponent } from 'app/modules/admin/appusers/dialog-delete-appuser/dialogdeleteappuser.component';


@Component({
    selector       : 'list-appusers',
    templateUrl    : './listappusers.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAppUsersComponent implements OnInit, AfterViewInit, OnDestroy {

    paConstituency = new FormControl(null, null);
    pollingLocation = new FormControl(null, null);
    electoralArea = new FormControl(null, null);
    cnicNumber = new FormControl(null, null);
    mobileNumber = new FormControl(null, null);
    accessLevel = new FormControl(null, null);
    userStatus = new FormControl(null, null);

    displayedColumns: string[] = ['rownumber', 'aur_userName', 'aur_fullName', 'aur_electoralArea', 'aur_accesslevel', 'aur_isActive', 'actions'];
    //term$ = new BehaviorSubject<string>('');
    resultsLength = 0;
    isLoading = false;

    ddPaConstituencies: any[] = null;
    ddPollingLocations: any[] = null;
    ddElectoralAreas: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    public dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private _appUsersService: AppUsersService,
        public _sharedService: SharedService,
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
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.populateListData();
        this.cdRef.detectChanges();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    populatePaConstituenciesDD(){
        this._sharedService.getPaConstituenciesDD()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.ddPaConstituencies = res.ddlist;
            });
    }

    populatePollingLocationsDD(){
        this._sharedService.getPollingLocationsDD(this.paConstituency.value, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.ddPollingLocations = res.ddlist,
                this.pollingLocation.setValue('');
            });
    }

    populateElectoralAreasDD(){
        this._sharedService.getElectoralAreasDD(this.paConstituency.value, null, this.pollingLocation.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddElectoralAreas = res.ddlist
            );
    }

    search(){
        this.populateListData();
    }

    clear(){
        this.paConstituency.setValue('');
        this.pollingLocation.setValue('');
        this.electoralArea.setValue('');
        this.cnicNumber = new FormControl(null, null);
        this.mobileNumber = new FormControl(null, null);
        this.accessLevel.setValue('');
        this.userStatus.setValue('');

        this.populateListData();
    }

    populateListData(){
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap((searchTerm) => {
            this.isLoading = true;

            const queryData: any = {
                ipaconstituency: this.paConstituency.value,
                ipollinglocationid: this.pollingLocation.value,
                ielectoralareaid: this.electoralArea.value,
                icnic: this.cnicNumber.value,
                imobile: this.mobileNumber.value,
                iaccesslevel: this.accessLevel.value,
                iuserstatus: this.userStatus.value,

                fromRow: (this.paginator.pageIndex * 25) + 1,
                toRow: (this.paginator.pageIndex + 1) * 25,
                sortColumn: this.sort.active,
                sortOrder: this.sort.direction,
                search: ''//(searchTerm && typeof searchTerm == 'string') ? searchTerm.toString() : ''
            }
            return this._appUsersService!.getListData(queryData)
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
        this.dialog.open(DialogViewAppUserDetailsComponent,{
          width:"620px", disableClose: false, autoFocus: true, //40%
          data: {
            rowData: rowData,
            eDom: e
          }
        });
    }

    updateDetails(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogUpdateAppUserDetailsComponent, {
          width: "500px", disableClose: false, autoFocus: true, //35%
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

    resetPassword(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogResetAppUserPasswordComponent, {
          width: "500px", disableClose: false, autoFocus: true, //35%
          data: {
            rowData: rowData,
            eDom: e
          }
        });

        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        });
    }

    deleteUser(rowData: any,  e: HTMLElement){
        const dialogRef = this.dialog.open(DialogDeleteAppUserComponent, {
          width: "500px", disableClose: false, autoFocus: true, //35%
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

    newAppUser(){
        const dialogRef = this.dialog.open(DialogNewAppUserComponent, {
          width: "500px", disableClose: false, autoFocus: true //35%
        });

        dialogRef.afterClosed().subscribe(()=>{
            //this.cdRef.detectChanges();
            this.populateListData();
        });
    }
}
