import { Component, Inject, ViewChild, Input, OnInit } from "@angular/core";
import { MatDialogRef, MatDialogClose, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

@Component({
    selector    : 'dialog-view-changerequest',
    templateUrl : './dialogviewchangerequest.component.html',
    styleUrls   : []
})
export class DialogViewChangeRequestComponent {
    @Input()
    secureUrl: SafeResourceUrl;

    model: any = null;
    lat: number;
    lng: number;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        public _sharedService: SharedService,
        public dialogRef: MatDialogRef<DialogViewChangeRequestComponent>,
        public sanitizer: DomSanitizer
    ){
        this.model = data.rowData;
        this.lat = data.rowData.nvr_locLat;
        this.lng = data.rowData.nvr_locLong;
    }

    ngOnInit() {
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?width=320&height=300&hl=en&q="+ this.lat +","+ this.lng +"&t=&z=12&ie=UTF8&iwloc=&output=embed");
    }

    closeDialog(){
        this.dialogRef.close();
    }
}
