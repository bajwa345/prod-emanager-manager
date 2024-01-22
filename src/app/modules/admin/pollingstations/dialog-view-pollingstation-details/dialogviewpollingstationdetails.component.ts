import { Component,Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

@Component({
    selector    : 'dialog-view-pollingstation-details',
    templateUrl : './dialogviewpollingstationdetails.component.html',
    styleUrls   : []
})
export class DialogViewPollingStationDetailsComponent{
    model: any = null;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        public dialogRef: MatDialogRef<DialogViewPollingStationDetailsComponent>,
        public _sharedService: SharedService
    ){
        this.model = data.rowData;
    }

    closeDialog(){
        this.dialogRef.close();
    }
}
