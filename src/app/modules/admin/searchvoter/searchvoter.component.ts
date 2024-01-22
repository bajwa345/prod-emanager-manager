import { ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, merge, of, Observable } from 'rxjs';
import { startWith, switchMap, takeUntil, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FuseLoadingBarService } from '@fuse/components/loading-bar';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { VotersService } from './../voters/voters.service';
import { DialogUpdateVoterDetailsComponent } from "app/modules/admin/voters/dialog-update-voter-details/dialogupdatevoterdetails.component";

import { environment } from 'environments/environment';

@Component({
    selector     : 'search-voter',
    templateUrl  : './searchvoter.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchVoterComponent
{
    user: User;

    srchValue = new FormControl('', [Validators.maxLength(13), this.validateInput]);
    votersList: any[] = null;
    storageUrl = environment.storageUrl;

    private parametersObservable: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _votersService: VotersService,
        private _fuseLoadingBarService: FuseLoadingBarService,
        public _sharedService: SharedService,
        private _userService: UserService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef,
        private route: ActivatedRoute) {}

    ngOnInit(): void
    {
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });

        this.parametersObservable = this.route.params.subscribe(params => {
            var sval = this.route.snapshot.paramMap.get('sval');
            sval = sval.replace(/=/g, '');
            if(sval) {
                this.srchValue.setValue(sval);
                sval = (sval.length == 11 && sval.startsWith('0')) ? sval.substring(1) : sval;
                this.populateData(sval);
            }
        });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        if(this.parametersObservable != null)
            this.parametersObservable.unsubscribe();
    }

    valueChange(event) {
        if(event.target.value.length == 12 || event.target.value.length == 15) {
            var istr = (event.target.value.length == 12 && event.target.value.startsWith('0') ? event.target.value.substring(1).replace(/-/g, '') : event.target.value.replace(/-/g, ''));
            this.populateData(istr);
        }
        else
            this.votersList = [];
    }

    populateData(str) {
        if(str.length == 10 || str.length == 13) {
            const queryData: any = {
                cnic: (str.length == 13 ? str : null),
                mobile: (str.length == 10 ? str : null),
            }

            this._votersService.getFamilyVotersDataByCnic(queryData)
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe(res => {
                this.votersList = res.items;
                this.cdRef.detectChanges();
            });
        }
        else
            this.votersList = [];
    }

    validateInput(c: FormControl) {
        let MOBILE_NO_REGEX = /^[0-9]{4}-[0-9]{7}$/;
        let NIC_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

        return (MOBILE_NO_REGEX.test(c.value) || NIC_REGEX.test(c.value)) ? null : {
          validateInput: {
            valid: false
          }
        };
    }

    updateVoterDetails(rowData: any,  e: HTMLElement){
        if(!rowData.vtr_addressUrl){
            this._votersService.getVoterAddressBlob(rowData.vtr_cnic)
            .subscribe(res =>
                rowData.vtr_addressBlob = res.item
            );
        }

        const dialogRef = this.dialog.open(DialogUpdateVoterDetailsComponent,{
            width: "540px", disableClose: false, autoFocus: true,
                data: {
                    rowData: rowData,
                    eDom: e
                }
            });
        dialogRef.afterClosed().subscribe(()=>{
            this.cdRef.detectChanges();
        })
    }

    downloadVoterParchi(){
        const requestObject: any = {
            icnic: this.srchValue.value
        };

        try {
            this._votersService.downloadVoterParchi(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                var blob = new Blob([data], {type: 'application/pdf'});
                var downloadURL = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "voterslip_"+requestObject.icnic.trim()+".pdf";
                link.click();
              });
        } catch (error) {
            alert('Something went wrong. Please try again');
        }
    }
}
