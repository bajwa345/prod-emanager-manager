import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgxMaskModule } from 'ngx-mask';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';

import { ListAppUsersComponent } from 'app/modules/admin/appusers/listappusers.component';
import { DialogNewAppUserComponent } from 'app/modules/admin/appusers/dialog-new-appuser/dialognewappuser.component';
import { DialogViewAppUserDetailsComponent } from 'app/modules/admin/appusers/dialog-view-appuser-details/dialogviewappuserdetails.component';
import { DialogUpdateAppUserDetailsComponent } from 'app/modules/admin/appusers/dialog-update-appuser-details/dialogupdateappuserdetails.component';
import { DialogResetAppUserPasswordComponent } from 'app/modules/admin/appusers/dialog-reset-appuser-password/dialogresetappuserpassword.component';
import { DialogDeleteAppUserComponent } from 'app/modules/admin/appusers/dialog-delete-appuser/dialogdeleteappuser.component';

const appUsersRoutes: Route[] = [
    {
        path     : '',
        component: ListAppUsersComponent
    }
];

@NgModule({
    declarations: [
        ListAppUsersComponent,
        DialogNewAppUserComponent,
        DialogViewAppUserDetailsComponent,
        DialogUpdateAppUserDetailsComponent,
        DialogResetAppUserPasswordComponent,
        DialogDeleteAppUserComponent
    ],
    imports: [
        RouterModule.forChild(appUsersRoutes),
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatCardModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,

        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        SharedModule,
        MatDialogModule,
        FuseAlertModule,
        PipesModule,
        NgxMaskModule.forRoot()
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})

export class AppUsersModule
{
}

