import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { PollingLocationsService } from './pollinglocations.service';
import { DialogViewPollingLocationDetailsComponent } from 'app/modules/admin/pollinglocations/dialog-view-pollinglocation-details/dialogviewpollinglocationdetails.component';
import { DialogUpdatePollingLocationDetailsComponent } from 'app/modules/admin/pollinglocations/dialog-update-pollinglocation-details/dialogupdatepollinglocationdetails.component';
import { VotersService } from './../voters/voters.service';
import { DialogViewBasicVoterDetailsComponent } from 'app/modules/admin/voters/dialog-view-basic-voter-details/dialogviewbasicvoterdetails.component';

import { environment } from 'environments/environment';

@Component({
    selector       : 'list-pollinglocations',
    templateUrl    : './listpollinglocations.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPollingLocationsComponent implements OnInit, OnDestroy {

    records: any;
    drawerOpened: boolean = true;
    filteredRecords: any[];
    selectedRecord: any;

    plNameLang: string;
    totalVoters: number;
    totalMaleVoters: number;
    totalFemaleVoters: number;
    totalBooths: number;

    isLoading = true;
    id: number;

    storageUrl = environment.storageUrl;
    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(private _pollingLocationsService: PollingLocationsService,
        private _votersService: VotersService,
        protected _sharedService: SharedService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef, private route: ActivatedRoute) { }

    ngOnInit(): void
    {
        this.selectedRecord = null;
        this.populateAllList();
        var routeid = this.route.snapshot.paramMap.get('id');
        if(routeid) {
            this.id = Number(atob(routeid));
            if(this.id > 1000) this.id = Number(this.id.toString().substring(4));
            this.populateSelectedRecord(this.id);
        }
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    _btoa(id: number) : string {
        var rec = btoa(Math.floor(1000 + Math.random() * 9000).toString() + id.toString());
        return rec.replace(/=/g, '');
    }

    updateDetailsPanel(did: string, e: Event): void
    {
        const decodedId = atob(did);
        this.id = Number(decodedId.substring(4));
        this.populateSelectedRecord(this.id);
    }

    populateSelectedRecord(id: number){
        this.totalVoters = 0;
        this.totalMaleVoters = 0;
        this.totalFemaleVoters = 0;
        this.totalBooths = 0;

        this._pollingLocationsService.getPollingLocationDetails(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>{
                this.selectedRecord = res.item;
                this.plNameLang = this._sharedService.isEnglishString(res.item.pollinglocation.plc_name) ? "eng" : "urdu";
                this.selectedRecord.pollingstations.forEach(item => {
                    this.totalVoters += item.pls_votersCount;
                    this.totalMaleVoters += item.pls_maleVotersCount;
                    this.totalFemaleVoters += item.pls_femaleVotersCount;
                    this.totalBooths += item.pls_boothsCount;
                });
                this.cdRef.detectChanges();
            });
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    populateAllList(){
        this.isLoading = true;
        this._pollingLocationsService.getListHeadersData()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>{
                this.isLoading = false;
                this.records = res.items;
                this.filteredRecords = this.records;
                if(res.items.length > 0) {
                    this.id = res.items[0].id;
                    this.populateSelectedRecord(res.items[0].id);
                }
                this.cdRef.detectChanges();
            });
    }

    filterRecords(query: string): void
    {
        if (!query) {
            this.filteredRecords = this.records;
            return;
        }
        this.filteredRecords = this.records.filter(record => record.name.toLowerCase().includes(query.toLowerCase()));
    }

    updateDetails(rowData: any,  e: HTMLElement){
        const _data = {
            id: rowData.pollinglocation.plc_id,
            name: rowData.pollinglocation.plc_name,
            votersCount: this.totalVoters,
            boothsCount: this.totalBooths,
            inchargeCnic: rowData.pollinglocation.plc_inchargeCnic
        }
        const dialogRef = this.dialog.open(DialogUpdatePollingLocationDetailsComponent,{
          width:"540px", disableClose: false, autoFocus: true, //40%
          data: {
            rowData: _data,
            eDom: e
          }
        });
        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
            this.populateSelectedRecord(_data.id);
        })
    }
}
