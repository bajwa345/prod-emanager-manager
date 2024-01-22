import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { PollingLocationsService } from './../pollinglocations.service';
import { PollingAgentsService } from './../../pollingagents/pollingagents.service';
import { VotersService } from './../../voters/voters.service';

import { environment } from 'environments/environment';

@Component({
    selector    : 'dialog-update-pollinglocation-details',
    templateUrl : './dialogupdatepollinglocationdetails.component.html',
    styleUrls   : []
})
export class DialogUpdatePollingLocationDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;
    @ViewChild('inchargeNameContainer') inchargeNameContainer: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    private storageUrl = environment.storageUrl;
    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogUpdatePollingLocationDetailsComponent>,
        public _sharedService: SharedService,
        private formBuilder: FormBuilder,
        private pollingLocationsService: PollingLocationsService,
        private _votersService: VotersService
    ){
        this.model = data.rowData;
        this.e = data.eDom;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
          {
            inchargeCnic: [this.model.inchargeCnic != 'null'? this.model.inchargeCnic: '', Validators.maxLength(13)],
          }
        );
        this.updateInfoByCnic();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateInfoByCnic(){
        if(this.form.value.inchargeCnic && this.form.value.inchargeCnic.length == 13) {
            this._votersService.getVoterBasicDetails(this.form.value.inchargeCnic)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.item != null) {
                    this.inchargeNameContainer.nativeElement.style.display = 'inline-block';
                    if(res.item.vtr_nameUrdu != null)
                    this.inchargeNameContainer.nativeElement.innerHTML = '<p id="incharge_name_text" class="incharge_name_txt urdu text-lg font-bold">'+res.item.vtr_nameUrdu+'</p>';
                    else if(res.item.vtr_nameUrl != null)
                    this.inchargeNameContainer.nativeElement.innerHTML = '<img id="incharge_name_blob" class="row_urdu_blob" onerror=\'this.style.display = "none"\' src="'+ this.storageUrl + res.item.vtr_nameUrl +'" />';
                    else
                    this.inchargeNameContainer.nativeElement.innerHTML = '<img id="incharge_name_blob" class="row_urdu_blob" onerror=\'this.style.display = "none"\' src="'+ 'data:image/png;base64,' + res.item.vtr_nameBlob+'" />';
                }
                else{
                    this.inchargeNameContainer.nativeElement.style.display = 'none';
                    this.inchargeNameContainer.nativeElement.innerHTML = '';
                }
            });
        }
        else {
            this.inchargeNameContainer.nativeElement.style.display = 'none';
            this.inchargeNameContainer.nativeElement.innerHTML = '';
        }
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
            plcId: this.model.id,
            inchargeCnic: this.form.value.inchargeCnic
        };

        try {
            this.pollingLocationsService.updatePollingLocationDetails(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                    this.model.inchargeCnic = this.form.value.inchargeCnic;
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
