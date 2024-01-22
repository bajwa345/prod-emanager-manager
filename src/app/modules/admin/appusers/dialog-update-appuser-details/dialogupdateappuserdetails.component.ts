import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppUsersService } from './../appusers.service';

@Component({
    selector    : 'dialog-update-appuser-details',
    templateUrl : './dialogupdateappuserdetails.component.html',
    styleUrls   : []
})
export class DialogUpdateAppUserDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    ddPollingLocations: any[] = null;
    ddElectoralAreas: any[] = null;
    accesslevelValue: number;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogUpdateAppUserDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private appUsersService: AppUsersService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            userName: [this.model.aur_userName],
            cnicNumber: [this.model.aur_cnic, Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13)])],
            fullName: [this.model.aur_fullName, Validators.compose([Validators.required, Validators.maxLength(32)])],
            accessLevel: [this.model.aur_accessLevelId.toString()],
            pollingLocation: [this.model.aur_pollingLocationId],
            electoralArea: [this.model.aur_electoralAreaId],
            whatsAppNumber: [this.model.aur_whatsApp ? '0' + this.model.aur_whatsApp : '', Validators.compose([Validators.minLength(11), Validators.maxLength(11)])],
            isActive: [this.model.aur_isActive]
        });

        this.accesslevelValue = this.model.aur_accessLevelId;
        this.populatePollingLocationDD();
        this.populateElectoralAreasDD();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog(){
        this.dialogRef.close(true);
    }

    populatePollingLocationDD(){
        this._sharedService.getPollingLocationsDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddPollingLocations = res.ddlist
            );
    }

    populateElectoralAreasDD(){
        this._sharedService.getElectoralAreasDD(null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res =>
                this.ddElectoralAreas = res.ddlist
            );
    }

    changeViewForAccesslevel(e: any){
        this.accesslevelValue = e.value;
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
        else if(this.form.value.accessLevel == 3 && !this.form.value.pollingLocation){
            this.showAlert('error', 'Please select Polling Location');
        }
        else if(this.form.value.accessLevel == 2 && !this.form.value.electoralArea){
            this.showAlert('error', 'Please select Electoral Area');
        }
        else {
            const requestObject: any = {
                userId: this.model.aur_id,
                cnicNumber: this.form.value.cnicNumber,
                fullName: this.form.value.fullName,
                accesslevel: this.form.value.accessLevel,
                plcId: this.form.value.accessLevel == 3 ? this.form.value.pollingLocation : '',
                elaId: this.form.value.accessLevel == 2 ? this.form.value.electoralArea : '',
                whatsAppNumber: this.form.value.whatsAppNumber,
                isActive: this.form.value.isActive
            };

            try {
                this.appUsersService.updateAppUserDetails(requestObject)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(res => {
                    if(res.type == "error") this.showAlert('error', res.message);
                    else {
                        this.showAlert('success', res.message);

                        this.model.aur_cnic = this.form.value.cnicNumber;
                        this.model.aur_fullName = this.form.value.fullName;
                        this.model.aur_accessLevelId = this.form.value.accessLevel;
                        this.model.aur_pollingLocationId = this.form.value.pollingLocation;
                        this.model.aur_electoralAreaId = this.form.value.electoralArea;
                        this.model.aur_whatsApp = this.form.value.whatsAppNumber;
                        this.model.aur_isActive = this.form.value.isActive;
                    }
                });
            } catch (error) {
                this.showAlert('error', 'Something went wrong. Please try again');
            }
        }

        this.formContainer.nativeElement.style.cursor = "default";
    }
}
