import { Component,Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { environment } from 'environments/environment';

@Component({
    selector    : 'dialog-view-pollingagents-details',
    templateUrl : './dialogviewpollingagentsdetails.component.html',
    styleUrls   : []
})
export class DialogViewPollingAgentsDetailsComponent{
    model: any = null;

    storageUrl = environment.storageUrl;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        public dialogRef: MatDialogRef<DialogViewPollingAgentsDetailsComponent>,
        public _sharedService: SharedService
    ){
        this.model = data.rowData;
    }

    closeDialog(){
        this.dialogRef.close();
    }
}
