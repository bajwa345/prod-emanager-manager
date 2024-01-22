import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector       : 'settings-manage-whatsapp',
    templateUrl    : './manage-whatsapp.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsManageWhatsAppComponent implements OnInit
{
    whatsAppForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder
    )
    {
    }

    ngOnInit(): void
    {
        this.whatsAppForm = this._formBuilder.group({
            send_new_polling_agent_instructions : [false],
            send_new_user_manual : [false],
            send_new_location_incharge_instructions : [false]
        });
    }
}
