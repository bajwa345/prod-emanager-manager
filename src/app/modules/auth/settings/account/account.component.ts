import { user } from './../../../../mock-api/common/user/data';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { SettingsService } from './../settings.service';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    user: User;
    accountForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _sharedService: SharedService,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void
    {
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;

                this.accountForm = this._formBuilder.group({
                    fullname : [user.name],
                    username : [user.username],
                    cnic     : [this._sharedService.formatCnic(user.cnic)],
                    signuptime : [user.signuptime],
                    mobile   : [this._sharedService.formatMobile(user.mobile)],
                    whatsapp : [this._sharedService.formatMobile(user.whatsapp)],

                    c_name   : [user.candidateeng],
                    c_image  : [user.avatar],
                    c_party  : [user.party.toUpperCase()],
                    c_symbol : [user.symbol.toUpperCase()],
                    c_constype  : [user.level == 'na' ? 'MNA' : (user.level == 'pa' ? 'MPA' : user.level.toUpperCase())],
                    c_constname : [user.constituency],
                    c_licensecode : [user.licensecode]
                });
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
