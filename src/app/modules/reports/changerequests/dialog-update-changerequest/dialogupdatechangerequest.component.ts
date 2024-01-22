import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from './../../reports.service';

@Component({
    selector    : 'dialog-update-changerequest',
    templateUrl : './dialogupdatechangerequest.component.html',
    styleUrls   : []
})
export class DialogUpdateChangeRequestComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogUpdateChangeRequestComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private reportsService: ReportsService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            requestType: [this.model.nvr_requestType],
            cnicNumber: [this.model.nvr_cnic, Validators.compose([Validators.minLength(13), Validators.maxLength(13)])],
            mobileNumber: [this.model.nvr_mobile ? '0' + this.model.nvr_mobile : '', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
            fullName: [this.model.nvr_name, Validators.compose([Validators.required, Validators.maxLength(32)])],
            partyAffiliation: [this.model.nvr_partyAffiliation, Validators.required],
            readyVolunteer: [this.model.nvr_readyVolunteer == true ? "1" : "0", Validators.required],
            details: [this.model.nvr_details],
            reqStatus: [this.model.nvr_status]
        });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog(){
        this.dialogRef.close(true);
    }

    showAlert(type: string, message: string): void
    {
        this.messageDiv.nativeElement.innerHTML = '<div class="my-1 message-'+type+'">'+ message +'</div>';
    }

    onSubmit(){
        this.formContainer.nativeElement.style.cursor  = "wait";
		this.messageDiv.nativeElement.innerHTML = '';

        if(this.form.invalid){
            this.showAlert('error', 'Please provide proper Form values');
        }
        else {
            const requestObject: any = {
                nvrId: this.model.nvr_id,
                requestType: this.form.value.requestType,
                cnicNumber: this.form.value.cnicNumber,
                mobileNumber: this.form.value.mobileNumber,
                fullName: this.form.value.fullName,
                partyAffiliation: this.form.value.partyAffiliation,
                readyVolunteer: this.form.value.readyVolunteer,
                details: this.form.value.details,
                status: this.form.value.reqStatus,
                resolveTime: this.model.resolveTime
            };

            try {
                this.reportsService.updateChangeRequest(requestObject)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(res => {
                    if(res.type == "error") this.showAlert('error', res.message);
                    else {
                        this.showAlert('success', res.message);

                        this.model.nvr_requestType = this.form.value.requestType;
                        this.model.nvr_name = this.form.value.fullName;
                        this.model.nvr_cnic = this.form.value.cnicNumber;
                        this.model.nvr_mobile = this.form.value.mobileNumber;
                        this.model.nvr_details = this.form.value.details;
                        this.model.nvr_status = this.form.value.reqStatus;
                    }
                });
            } catch (error) {
                this.showAlert('error', 'Something went wrong. Please try again');
            }
        }

        this.formContainer.nativeElement.style.cursor = "default";
    }
}
