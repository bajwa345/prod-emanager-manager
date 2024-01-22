import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseAlertService } from '@fuse/components/alert';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';

import { PoliticalWorkersService } from '../politicalworkers.service';

@Component({
    selector    : 'dialog-new-politicalworker-details',
    templateUrl : './dialognewpoliticalworkerdetails.component.html'
})
export class DialogNewPoliticalWorkerDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    form: FormGroup;
    model: any;
    e: HTMLElement;
    message: HTMLElement;

    private _unsubscribeAll: Subject<ReturnDataModel> = new Subject<ReturnDataModel>();

    constructor(
        private dialogRef: MatDialogRef<DialogNewPoliticalWorkerDetailsComponent>,
        public _sharedService: SharedService,
        private _fuseAlertService: FuseAlertService,
        private formBuilder: FormBuilder,
        private politicalWorkersService: PoliticalWorkersService
    ){
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
          {
            name: ['', Validators.required],
            fatherName: ['', Validators.required],
            age: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(10), Validators.max(120)])],
            gender: ['M', Validators.required],
            address: ['', Validators.compose([Validators.required, Validators.maxLength(128)])],
            cnic: ['', Validators.compose([Validators.minLength(13), Validators.maxLength(13)])],
            mobileNumber: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11)])]
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
            this.showAlert('error', 'Please provide proper form values.');
            return;
        }

        const requestObject: any = {
            name: this.form.value.name,
            fatherName: this.form.value.fatherName,
            age: this.form.value.age,
            gender: this.form.value.gender,
            address: this.form.value.address,
            cnic: this.form.value.cnic,
            mobileNumber: this.form.value.mobileNumber
        };

        try {
            this.politicalWorkersService.newWorker(requestObject)
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
