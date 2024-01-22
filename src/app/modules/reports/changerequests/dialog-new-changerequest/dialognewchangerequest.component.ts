import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from '../../reports.service';

@Component({
    selector    : 'dialog-new-changerequest',
    templateUrl : './dialognewchangerequest.component.html',
    styleUrls   : []
})
export class DialogNewChangeRequestComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    message: HTMLElement;

    ddPollingLocations: any[] = null;
    ddElectoralAreas: any[] = null;
    accesslevelValue: number;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(private dialogRef: MatDialogRef<DialogNewChangeRequestComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private reportsService: ReportsService
    ){
        this.model = null;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            requestType: ['transfer vote'],
            cnicNumber: ['', Validators.compose([Validators.minLength(13), Validators.maxLength(13)])],
            mobileNumber: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
            fullName: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
            partyAffiliation: ['pti', Validators.required],
            readyVolunteer: ['0', Validators.required],
            details: [''],
            reqStatus: ['new']
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
                requestType: this.form.value.requestType,
                cnicNumber: this.form.value.cnicNumber,
                mobileNumber: this.form.value.mobileNumber,
                fullName: this.form.value.fullName,
                partyAffiliation: this.form.value.partyAffiliation,
                readyVolunteer: this.form.value.readyVolunteer,
                details: this.form.value.details
            };

            try {
                this.reportsService.newChangeRequest(requestObject)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(res => {
                    if(res.type == "error") this.showAlert('error', res.message);
                    else {
                        this.showAlert('success', res.message);
                        this.form.reset();
                    }
                });
            } catch (error) {
                this.showAlert('error', 'Something went wrong. Please try again');
            }
        }

        this.formContainer.nativeElement.style.cursor = "default";
    }
}
