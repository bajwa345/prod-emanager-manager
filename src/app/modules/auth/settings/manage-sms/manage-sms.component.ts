import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector       : 'settings-manage-sms',
    templateUrl    : './manage-sms.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsManageSmsComponent implements OnInit
{
    totalSms : number;
    remainingSms : number;
    smsForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder
    )
    {
    }

    ngOnInit(): void
    {
        this.smsForm = this._formBuilder.group({
            sms_political_worker_welcome: [false],
            sms_polling_agent_welcome   : [false],
            searchType   : [''],
            pollingStation: [],
            messageTxt : ['']
        });

        this.totalSms = 0;//100000;
        this.remainingSms = 0;//99998;
    }
}
