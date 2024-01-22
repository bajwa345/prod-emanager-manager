import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { PoliticalWorkersService } from '../politicalworkers.service';

@Component({
    selector    : 'dialog-update-politicalworker-details',
    templateUrl : './dialogupdatepoliticalworkerdetails.component.html'
})
export class DialogUpdatePoliticalWorkerDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogUpdatePoliticalWorkerDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private politicalWorkersService: PoliticalWorkersService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
          {
            name: [this.model.plw_name, Validators.required],
            fatherName: [this.model.plw_fatherHusband, Validators.required],
            age: [this.model.plw_age, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(10), Validators.max(120)])],
            gender: [this.model.plw_gender, Validators.required],
            address: [this.model.plw_address, Validators.compose([Validators.required, Validators.maxLength(128)])],
            cnic: [this.model.plw_cnic, Validators.compose([Validators.minLength(13), Validators.maxLength(13)])],
            mobileNumber: [(this.model.plw_mobile && this.model.plw_mobile.length > 0) ? '0' + this.model.plw_mobile : '', Validators.compose([Validators.minLength(11), Validators.maxLength(11)])]
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
            id: this.model.plw_id,
            name: this.form.value.name,
            fatherName: this.form.value.fatherName,
            age: this.form.value.age,
            gender: this.form.value.gender,
            address: this.form.value.address,
            cnic: this.form.value.cnic,
            mobileNumber: this.form.value.mobileNumber
        };

        try {
            this.politicalWorkersService.updateWorker(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                    this.form.reset();
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
