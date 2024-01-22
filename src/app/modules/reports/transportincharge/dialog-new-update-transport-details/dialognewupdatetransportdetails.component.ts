import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from './../../reports.service';

@Component({
    selector    : 'dialog-new-update-transport-details',
    templateUrl : './dialognewupdatetransportdetails.component.html',
    styleUrls   : []
})
export class DialogNewUpdateTransportDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    ddPollingLocations: any[] = null;
    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogNewUpdateTransportDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private reportsService: ReportsService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
          {
            plcId: [this.model.plc_id, Validators.required],
            vans: [this.model.vehical_van, Validators.maxLength(4)],
            rikshas: [this.model.vehical_riksha, Validators.maxLength(4)],
            cars: [this.model.vehical_car, Validators.maxLength(4)]
          }
        );

        this.populatePollingLocationDD();
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

    showAlert(type: string, message: string): void
    {
        this.messageDiv.nativeElement.innerHTML = '<div class="my-1 message-'+type+'">'+ message +'</div>';
    }

    onSubmit(){
        this.formContainer.nativeElement.style.cursor  = "wait";

        if(this.form.invalid){
            this.showAlert('error', 'Please provide proper form values.');
            return;
        }

        const requestObject: any = {
            plcId: this.model.plc_id, //this.form.value.plcId,
            vans: this.form.value.vans ? this.form.value.vans : 0,
            rikshas: this.form.value.rikshas ? this.form.value.rikshas : 0,
            cars: this.form.value.cars ? this.form.value.cars : 0
        };

        try {
            this.reportsService.updateTransportDemand(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                    this.model.vehical_van = this.form.value.vans;
                    this.model.vehical_riksha = this.form.value.rikshas;
                    this.model.vehical_car = this.form.value.cars;
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
