import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';

import { ListPollingLocationsComponent } from 'app/modules/admin/pollinglocations/listpollinglocations.component';
import { DialogViewPollingLocationDetailsComponent } from 'app/modules/admin/pollinglocations/dialog-view-pollinglocation-details/dialogviewpollinglocationdetails.component';
import { DialogUpdatePollingLocationDetailsComponent } from 'app/modules/admin/pollinglocations/dialog-update-pollinglocation-details/dialogupdatepollinglocationdetails.component';

const pollingLocationsRoutes: Route[] = [
    {
        path     : '',
        component: ListPollingLocationsComponent
    },
    {
        path     : ':id',
        component: ListPollingLocationsComponent
    }
];

@NgModule({
    declarations: [
        ListPollingLocationsComponent,
        DialogViewPollingLocationDetailsComponent,
        DialogUpdatePollingLocationDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(pollingLocationsRoutes),
        CommonModule,
        MatCardModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        FuseScrollbarModule,

        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSidenavModule,
        MatRadioModule,
        MatSelectModule,
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

export class PollingLocationsModule
{
}
