import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { AgmCoreModule, GoogleMapsAPIWrapper, AgmMap, AgmDataLayer, AgmKmlLayer } from '@agm/core';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { VotersService } from './../../voters/voters.service';

@Component({
    selector    : 'dialog-view-blockcode-details',
    templateUrl : './dialogviewblockcodedetails.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogViewBlockCodeDetailsComponent {

    lat: number = 33.673038;
    lng: number = 72.984138;
    zoom: number = 8; 
    kmlUrl: any = null; 
    
    model: any = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private _votersService: VotersService,
        public dialogRef: MatDialogRef<DialogViewBlockCodeDetailsComponent>
    ){
        this.model = data.rowData;
        this.kmlUrl = data.rowData.blc_kmlFile;
    }

    closeDialog(){
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close(this.model);
    }

    DownloadVoterParchi(blc_code: number, blc_parchiUrl: string){
        if(blc_parchiUrl != null && blc_parchiUrl != ''){ 
            window.open(blc_parchiUrl, '_blank');    
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
                iblockcode: blc_code
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

    DownloadVoterList(blc_code: number){
        alert("voter list : under construction");
    }

    DownloadFamilyWiseList(blc_code: number){
        alert("family wise list : under construction");
    }
}
