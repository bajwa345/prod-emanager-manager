import { Component,Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector    : 'dialog-view-appuser-details',
    templateUrl : './dialogviewappuserdetails.component.html',
    styleUrls   : []
})
export class DialogViewAppUserDetailsComponent {

    model: any = null;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        public _sharedService: SharedService,
        public dialogRef: MatDialogRef<DialogViewAppUserDetailsComponent>
    ){
        this.model = data.rowData;
    }

    closeDialog(){
        this.dialogRef.close();
    }
}
