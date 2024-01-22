import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
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

import { ResultCompilationComponent } from 'app/modules/admin/resultcompilation/resultcompilation.component';
import { DialogNewResultDetailsComponent } from 'app/modules/admin/resultcompilation/dialog-new-result-details/dialognewresultdetails.component';
import { DialogUpdateResultDetailsComponent } from 'app/modules/admin/resultcompilation/dialog-update-result-details/dialogupdateresultdetails.component';

const resultCompilationRoutes: Route[] = [
    {
        path     : '',
        component: ResultCompilationComponent
    }
];

@NgModule({
    declarations: [
        ResultCompilationComponent,
        DialogNewResultDetailsComponent,
        DialogUpdateResultDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(resultCompilationRoutes),
        CommonModule,
        MatCardModule,
        MatProgressBarModule,
        FuseScrollbarModule,
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
        SharedModule
    ]
})
export class ResultCompilationModule
{
}
