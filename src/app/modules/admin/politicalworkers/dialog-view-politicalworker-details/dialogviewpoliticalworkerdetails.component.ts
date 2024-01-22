import { Component,Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector    : 'dialog-view-politicalworker-details',
    templateUrl : './dialogviewpoliticalworkerdetails.component.html',
    styleUrls   : []
})
export class DialogViewPoliticalWorkerDetailsComponent {

    model: any = null;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        public dialogRef: MatDialogRef<DialogViewPoliticalWorkerDetailsComponent>
    ){
        this.model = data.rowData;
    }

    closeDialog(){
        this.dialogRef.close();
    }
}
