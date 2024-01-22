import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgxMaskModule } from 'ngx-mask';
import { PipesModule } from 'app/pipes/pipes.module';

import { ListVotersComponent } from 'app/modules/admin/voters/listvoters.component';
import { DialogViewVoterDetailsComponent } from 'app/modules/admin/voters/dialog-view-voter-details/dialogviewvoterdetails.component';
import { DialogViewBasicVoterDetailsComponent } from 'app/modules/admin/voters/dialog-view-basic-voter-details/dialogviewbasicvoterdetails.component';
import { DialogUpdateVoterDetailsComponent } from 'app/modules/admin/voters/dialog-update-voter-details/dialogupdatevoterdetails.component';

const votersRoutes: Route[] = [
    {
        path     : '',
        component: ListVotersComponent
    }
];

@NgModule({
    declarations: [
        ListVotersComponent,
        DialogViewVoterDetailsComponent,
        DialogViewBasicVoterDetailsComponent,
        DialogUpdateVoterDetailsComponent
    ],
    imports: [
        RouterModule.forChild(votersRoutes),
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

export class VotersModule
{
}
