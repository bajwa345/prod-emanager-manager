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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';

import { ListPoliticalWorkersComponent } from 'app/modules/admin/politicalworkers/listpoliticalworkers.component';
import { DialogNewPoliticalWorkerDetailsComponent } from 'app/modules/admin/politicalworkers/dialog-new-politicalworker-details/dialognewpoliticalworkerdetails.component';
import { DialogUpdatePoliticalWorkerDetailsComponent } from 'app/modules/admin/politicalworkers/dialog-update-politicalworker-details/dialogupdatepoliticalworkerdetails.component';

const politicalWorkersRoutes: Route[] = [
    {
        path     : '',
        component: ListPoliticalWorkersComponent
    }
];

@NgModule({
    declarations: [
        ListPoliticalWorkersComponent,
        DialogNewPoliticalWorkerDetailsComponent,
        DialogUpdatePoliticalWorkerDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(politicalWorkersRoutes),
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
        MatTooltipModule,
        PipesModule,
        NgxMaskModule.forRoot()
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})

export class PoliticalWorkersModule
{
}

