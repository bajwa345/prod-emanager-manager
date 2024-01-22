import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { VotersService } from './../voters.service';

import { environment } from 'environments/environment';

@Component({
    selector    : 'dialog-update-voter-details',
    templateUrl : './dialogupdatevoterdetails.component.html',
    styleUrls   : []
})
export class DialogUpdateVoterDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    storageUrl = environment.storageUrl;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogUpdateVoterDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private votersService: VotersService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
          {
            mobileNumber1: [this.model.vtr_mobile && this.model.vtr_mobile != 'null' && this.model.vtr_mobile != '0' ? '0' + this.model.vtr_mobile: '', Validators.maxLength(11)],
            mobileNumber2: [this.model.vtr_mobile2 && this.model.vtr_mobile2 != 'null' && this.model.vtr_mobile2 != '0' ? '0' + this.model.vtr_mobile2: '', Validators.maxLength(11)],
            mobileNumber3: [this.model.vtr_mobile3 && this.model.vtr_mobile3 != 'null' && this.model.vtr_mobile3 != '0' ? '0' + this.model.vtr_mobile3: '', Validators.maxLength(11)],
            whatsAppNumber: [this.model.vtr_whatsApp && this.model.vtr_whatsApp != 'null' && this.model.vtr_whatsApp != '0' ? '0' + this.model.vtr_whatsApp: '', Validators.maxLength(11)]
          }
        );
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

        if(this.form.invalid){
            this.showAlert('error', 'Please provide proper Form values.');
            return;
        }

        const requestObject: any = {
            cnic: this.model.vtr_cnic,
            phonenumber1: this.form.value.mobileNumber1,
            phonenumber2: this.form.value.mobileNumber2,
            phonenumber3: this.form.value.mobileNumber3,
            whatsappnumber: this.form.value.whatsAppNumber
        };

        try {
            this.votersService.updateVoterDetails(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                    this.model.vtr_mobile = this.form.value.mobileNumber1;
                    this.model.vtr_mobile2 = this.form.value.mobileNumber2;
                    this.model.vtr_mobile3 = this.form.value.mobileNumber3;
                    this.model.vtr_whatsApp = this.form.value.whatsAppNumber;
                }
            }, error => {
                this.showAlert('error', 'Operation failed');
            });
        } catch (error) {
            this.showAlert('error', 'Something went wrong. Please try again');
        }

        this.formContainer.nativeElement.style.cursor  = "default";
    }
}
