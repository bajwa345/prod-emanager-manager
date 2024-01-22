import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from './../../reports.service';

@Component({
    selector    : 'dialog-progress-changerequest',
    templateUrl : './dialogprogresschangerequest.component.html',
    styleUrls   : []
})
export class DialogProgressChangeRequestComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: {rowData: any, eDom: HTMLElement},
        private dialogRef: MatDialogRef<DialogProgressChangeRequestComponent>,
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
            userName: [this.model.aur_userName],
            cnicNumber: [this.model.aur_cnic],
            fullName: [this.model.aur_fullName],
            password: ['', Validators.compose([Validators.required, Validators.maxLength(8)])]
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
            userId: this.model.aur_id,
            password: this.form.value.password
        };

        try {
            this.reportsService.progressChangeRequest(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else this.showAlert('success', res.message);
            }, error => {
                this.showAlert('error', 'Operation failed');
            });
        } catch (error) {
            this.showAlert('error', 'Something went wrong. Please try again');
        }

        this.formContainer.nativeElement.style.cursor  = "default";
    }
}
