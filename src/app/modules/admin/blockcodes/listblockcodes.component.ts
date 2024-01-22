import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { BlockCodesService } from './blockcodes.service';
import { VotersService } from './../voters/voters.service';
import { PollingStationsService } from './../pollingstations/pollingstations.service';
import { DialogViewPollingStationDetailsComponent } from 'app/modules/admin/pollingstations/dialog-view-pollingstation-details/dialogviewpollingstationdetails.component';
import { DialogViewBlockCodeDetailsComponent } from './dialog-view-blockcode-details/dialogviewblockcodedetails.component';


@Component({
    selector       : 'list-blockcodes',
    templateUrl    : './listblockcodes.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListBlockCodesComponent implements OnInit, AfterViewInit, OnDestroy {

    pollingLocation = new FormControl(null, null);
    pollingStation = new FormControl(null, null);
    electoralArea = new FormControl(null, null);
    searchType = new FormControl(null, null);

    displayedColumns: string[] = ['rownumber', 'blc_code', 'pollingStations', 'blc_maleVotersCount', 'blc_femaleVotersCount', 'blc_votersCount', 'actions'];
    resultsLength = 0;
    isLoading = false;

    ddPollingLocations: any[] = null;
    ddPollingStations: any[] = null;
    ddElectoralAreas: any[] = null;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    public dataSource = new MatTableDataSource<any>();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private _blockCodesService: BlockCodesService,
        private _pollingStationsService: PollingStationsService,
        private _votersService: VotersService,
        private _sharedService: SharedService,
        private http: HttpClient,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this.populatePollingLocationDD();
        this.populatePollingStationDD();
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

    populatePollingLocationDD(){
        this._sharedService.getPollingLocationsDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.ddPollingLocations = res.ddlist,
                this.pollingLocation.setValue('');
            });
    }

    populatePollingStationDD(){
        this._sharedService.getPollingStationsDD(null, null, this.pollingLocation.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddPollingStations = res.ddlist
            );
    }

    populateElectoralAreasDD(){
        this._sharedService.getElectoralAreasDD(null, null, this.pollingLocation.value, this.pollingStation.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddElectoralAreas = res.ddlist
            );
    }

    search(){
        this.populateListData();
    }

    clear(){
        this.pollingLocation.setValue('');
        this.pollingStation.setValue('');
        this.electoralArea.setValue('');
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
                ipollingstationid: this.pollingStation.value,
                ielectoralareaid: this.electoralArea.value,
                isearchtype: this.searchType.value,

                fromRow: (this.paginator.pageIndex * 25) + 1,
                toRow: (this.paginator.pageIndex + 1) * 25,
                sortColumn: this.sort.active,
                sortOrder: this.sort.direction,
                search: ''
            }
            return this._blockCodesService!.getListData(queryData)
              .pipe(catchError(() => of(null)));
          }),
          map(data => {
            this.isLoading = false;
            if (data === null || data.items.length === 0) {
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

    viewBlockCodeDetails(rowData: any,  e: HTMLElement){
        this.dialog.open(DialogViewBlockCodeDetailsComponent,{
          width: rowData.blc_kmlFile == null ? "540px" : "740px", disableClose: false, autoFocus: true, 
          data: {
            rowData: rowData,
            eDom: e
          }
        });
    }

    viewPollingStationDetails(rowData: any,  e: HTMLElement){
        this._pollingStationsService.getPollingStationDetails(rowData.pls_id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.item != null) {
                    this.dialog.open(DialogViewPollingStationDetailsComponent,{
                        width: "640px", height: '600px', disableClose: false, autoFocus: true,
                        data: {
                          rowData: res.item
                        }
                    });
                }
            });
    }

    DownloadBlockCodeList(){
        alert("block code list not attached");
    }

    DownloadVoterParchi(rowData: any,  e: HTMLElement){
        
        if(rowData.blc_parchiUrl != null && rowData.blc_parchiUrl != ''){ 
            window.open(rowData.blc_parchiUrl, '_blank');    
            return false;

            /*this._votersService.downloadVoterParchiPdfBlob(rowData.blc_parchiUrl)
                .subscribe((blob: Blob): void => {
                const file = new Blob([blob], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank', 'fullscreen=yes');
            });*/
        }
        else {
            const requestObject: any = {
                iblockcode: rowData.blc_code
            };

            try {
                this._votersService.downloadVoterParchi(requestObject)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((data) => {
                    var blob = new Blob([data], {type: 'application/pdf'});
                    var downloadURL = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "voterslip_"+requestObject.iblockcode.trim()+".pdf";
                    link.click();
                });
            } catch (error) {
                alert('Something went wrong. Please try again');
            }
        }
    }

    DownloadVoterList(rowData: any,  e: HTMLElement){
        alert("not implemented yet");
    }
}
