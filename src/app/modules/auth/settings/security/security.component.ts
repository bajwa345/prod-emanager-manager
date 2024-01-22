import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseAlertModule } from '@fuse/components/alert';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { SettingsService } from './../settings.service';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    @ViewChild('formContainer') formContainer: ElementRef;
    @ViewChild('messageDiv') messageDiv: ElementRef;

    user: User;
    securityForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _settingsService: SettingsService,
        private _userService: UserService,
        private _formBuilder: FormBuilder
    ){}

    ngOnInit(): void
    {
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
                this.securityForm = this._formBuilder.group({
                    username         : [user.username],
                    currentPassword  : ['', [Validators.required]],
                    newPassword      : ['', [Validators.required, Validators.minLength(6)]],
                    newPassword2     : ['', [Validators.required, Validators.minLength(6)]]
                });
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSubmit(){
        this.formContainer.nativeElement.style.cursor  = "wait";
        this.messageDiv.nativeElement.innerHTML = '';

        if(this.securityForm.invalid){
            this.showAlert('error', 'Please provide proper form values.');
            return;
        }

        if(this.securityForm.value.newPassword != this.securityForm.value.newPassword2){
            this.showAlert('error', 'Both new Passwords not matched.');
            return;
        }

        const requestObject: any = {
            password: this.securityForm.value.currentPassword,
            newpassword: this.securityForm.value.newPassword
        };

        try {
            this._settingsService.updateAccountPassword(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") this.showAlert('error', res.message);
                else {
                    this.showAlert('success', res.message);
                }
            }, error => {
                this.showAlert('error', 'Operation failed');
            });
        } catch (error) {
            this.showAlert('error', 'Something went wrong. Please try again');
        }

        this.formContainer.nativeElement.style.cursor  = "default";
    }

    showAlert(type: string, message: string): void
    {
        this.messageDiv.nativeElement.innerHTML = '<div class="my-1 message-'+type+'">'+ message +'</div>';
    }

}
