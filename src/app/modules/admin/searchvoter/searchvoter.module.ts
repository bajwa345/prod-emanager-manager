import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocompleteModule } from '@angular/material/autocomplete';

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
import { NgxMaskModule } from 'ngx-mask';
import { PipesModule } from 'app/pipes/pipes.module';

import { SearchVoterComponent } from 'app/modules/admin/searchvoter/searchvoter.component';

const resultCompilationRoutes: Route[] = [
    {
        path     : '',
        component: SearchVoterComponent
    },
    {
        path     : ':sval',
        component: SearchVoterComponent
    }
];

@NgModule({
    declarations: [
        SearchVoterComponent
    ],
    imports     : [
        RouterModule.forChild(resultCompilationRoutes),
        MatAutocompleteModule,
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
        SharedModule,
        PipesModule,
        NgxMaskModule.forRoot()
    ]
})
export class SearchVoterModule
{
}
