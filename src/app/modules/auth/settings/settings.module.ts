import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { SharedModule } from 'app/shared/shared.module';

import { SettingsComponent } from 'app/modules/auth/settings/settings.component';
import { SettingsAccountComponent } from 'app/modules/auth/settings/account/account.component';
import { SettingsSecurityComponent } from 'app/modules/auth/settings/security/security.component';
import { SettingsPlanBillingComponent } from 'app/modules/auth/settings/plan-billing/plan-billing.component';
import { SettingsManageSmsComponent } from 'app/modules/auth/settings/manage-sms/manage-sms.component';
import { SettingsManageWhatsAppComponent } from 'app/modules/auth/settings/manage-whatsapp/manage-whatsapp.component';
import { SettingsContactUsComponent } from 'app/modules/auth/settings/contactus/contactus.component';

const settingsRoutes: Route[] = [
    {
        path     : '',
        component: SettingsComponent
    }
];

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsManageSmsComponent,
        SettingsManageWhatsAppComponent,
        SettingsContactUsComponent
    ],
    imports : [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        FuseScrollbarModule,
        SharedModule
    ]
})
export class SettingsModule
{
}
