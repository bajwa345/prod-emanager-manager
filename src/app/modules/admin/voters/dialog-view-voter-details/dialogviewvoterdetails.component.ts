import { Component, Inject, ViewChild, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, distinctUntilChanged } from 'rxjs/operators';
import { MatDialogRef, MatDialogClose, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { VotersService } from './../voters.service';

import { environment } from 'environments/environment';

@Component({
    selector    : 'dialog-view-voter-details',
    templateUrl : './dialogviewvoterdetails.component.html',
    styleUrls   : []
})
export class DialogViewVoterDetailsComponent implements OnInit{
    @Input()
    secureUrl: SafeResourceUrl;

    model: any = null;
    lat: number;
    lng: number;

    storageUrl = environment.storageUrl;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();
    private _unsubscribeAll1: Subject<any> = new Subject<any>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogViewVoterDetailsComponent>,
        public _sharedService: SharedService,
        private votersService: VotersService,
        public sanitizer: DomSanitizer
    ){
        this.model = data.rowData;
        this.lat = data.rowData.vtr_locLat;
        this.lng = data.rowData.vtr_locLong;
    }

    ngOnInit() {
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?width=320&height=300&hl=en&q="+ this.lat +","+ this.lng +"&t=&z=12&ie=UTF8&iwloc=&output=embed");
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog(){
        this.dialogRef.close();
    }

    downloadVoterParchi(){
        const requestObject: any = {
            icnic: this.model.vtr_cnic
        };

        try {
            this.votersService.downloadVoterParchi(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                var blob = new Blob([data], {type: 'application/pdf'});
                var downloadURL = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "voterslip_"+requestObject.icnic.trim()+".pdf";
                link.click();
              });
        } catch (error) {
            alert('Something went wrong. Please try again');
        }
    }
}
