import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { VotersService } from './voters.service';
import { BlockCodesService } from './../blockcodes/blockcodes.service';

import { DialogViewVoterDetailsComponent } from "./dialog-view-voter-details/dialogviewvoterdetails.component";
import { DialogUpdateVoterDetailsComponent } from "./dialog-update-voter-details/dialogupdatevoterdetails.component";
import { DialogViewBlockCodeDetailsComponent } from "app/modules/admin/blockcodes/dialog-view-blockcode-details/dialogviewblockcodedetails.component";

import { environment } from 'environments/environment';


@Component({
    selector     : 'list-voters',
    templateUrl  : './listvoters.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListVotersComponent implements OnInit, AfterViewInit, OnDestroy {

    pollingLocation = new FormControl(null, null);
    blockCode = new FormControl(null, null);
    cnicNumber = new FormControl(null, null);
    gender = new FormControl(null, null);
    serialNumber = new FormControl(null, null);
    familyNumber = new FormControl(null, null);
    mobileNumber = new FormControl(null, null);
    searchType = new FormControl(null, null);

    searchBtn = new FormControl(null, null);

    displayedColumns: string[] = ['rownumber', 'vtr_cnic', 'vtr_silsila', 'vtr_girana', 'vtr_name', 'vtr_fhname', 'vtr_age', 'vtr_gender', 'vtr_blockCode', 'actions'];
    resultsLength = 0;
    isLoading = false;

    ddPollingLocations: any[] = null;
    ddBlockCodes: any[] = null;
    storageUrl = environment.storageUrl;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    public dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private _votersService: VotersService,
        protected _sharedService: SharedService,
        private _blockCodesService: BlockCodesService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this.populatePollingLocationDD();
        this.populateBlockcodeDD();
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

    populatePollingLocationDD(){
        this._sharedService.getPollingLocationsDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddPollingLocations = res.ddlist
            );
    }

    populateBlockcodeDD(){
        this._sharedService.getBlockCodesDD(null, null, this.pollingLocation.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddBlockCodes = res.ddlist
            );
    }

    getVoterAddressImage(cnic: string){
        this._votersService!.getVoterAddressBlob(cnic)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddBlockCodes = res
            );
    }

    search(){
        this.populateListData();
    }

    clear(){
        this.pollingLocation.setValue('');
        this.blockCode.setValue('');
        this.cnicNumber = new FormControl(null, null);
        this.gender.setValue('');
        this.serialNumber = new FormControl(null, null);
        this.familyNumber = new FormControl(null, null);
        this.mobileNumber = new FormControl(null, null);
        this.searchType.setValue('');

        this.populateListData();
    }

    populateListData(){
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap((searchTerm) => {
            this.isLoading = true;

            const queryData: any = {
                ipollinglocationid: this.pollingLocation.value,
                iblockcode: this.blockCode.value,
                icnic: this.cnicNumber.value,
                igender: this.gender.value,
                isilsila: this.serialNumber.value,
                igarana: this.familyNumber.value,
                imobile: this.mobileNumber.value && this.mobileNumber.value.substring(0,1) == '0' ? this.mobileNumber.value.substring(1) : this.mobileNumber.value,
                isearchtype: this.searchType.value,

                fromRow: (this.paginator.pageIndex * 50) + 1,
                toRow: (this.paginator.pageIndex + 1) * 50,
                sortColumn: this.sort.active,
                sortOrder: this.sort.direction,
                search: ''
            }
            return this._votersService!.getListData(queryData)
              .pipe(catchError(() => of(null)));
          }),
          map(data => {
            this.isLoading = false;
            if (data === null || data.rows_count === 0) {
                this.resultsLength = 0;
                this.dataSource.data = [];
            }
            else {
                this.resultsLength = data.rows_count;
                this.dataSource.data = data.items;
            }
            this.cdRef.detectChanges();
            return data;
          })
        ).subscribe(data => {
            this._unsubscribeAll.next(data);
        });
    }

    viewVoterDetails(rowData: any,  e: HTMLElement){
        if(!rowData.vtr_addressUrl){
            this._votersService.getVoterAddressBlob(rowData.vtr_cnic)
            .subscribe(res =>
                rowData.vtr_addressBlob = res.item
            );
        }

        this.dialog.open(DialogViewVoterDetailsComponent,{
            width: "884px", disableClose: false, autoFocus: true, //66%
            data: {
                rowData: rowData,
                eDom: e
            }
        });
    }

    updateVoterDetails(rowData: any,  e: HTMLElement){
        if(!rowData.vtr_addressUrl){
            this._votersService.getVoterAddressBlob(rowData.vtr_cnic)
            .subscribe(res =>
                rowData.vtr_addressBlob = res.item
            );
        }

        const dialogRef = this.dialog.open(DialogUpdateVoterDetailsComponent,{
            width: "540px", disableClose: false, autoFocus: true, 
                data: {
                    rowData: rowData,
                    eDom: e
                }
            });
        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        })
    }

    viewBlockCodeDetails(rowData: any,  e: HTMLElement){
        this._blockCodesService.getBlockCodeDetails(rowData.vtr_blockCode)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.item != null) {
                    console.log(res.item.blc_kmlFile);
                    this.dialog.open(DialogViewBlockCodeDetailsComponent,{
                        width: res.item.blc_kmlFile == null ? "540px" : "740px", disableClose: false, autoFocus: true, 
                        data: {
                          rowData: res.item,
                          eDom: e
                        }
                    });
                }
            });
    }
}
