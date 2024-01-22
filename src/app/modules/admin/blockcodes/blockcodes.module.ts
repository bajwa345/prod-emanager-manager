import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AgmCoreModule, GoogleMapsAPIWrapper, AgmMap, AgmDataLayer } from '@agm/core';
import { SharedModule } from 'app/shared/shared.module';

import { ListBlockCodesComponent } from 'app/modules/admin/blockcodes/listblockcodes.component';
import { DialogViewBlockCodeDetailsComponent } from 'app/modules/admin/blockcodes/dialog-view-blockcode-details/dialogviewblockcodedetails.component';

const blockCodesRoutes: Route[] = [
    {
        path     : '',
        component: ListBlockCodesComponent
    }
];

@NgModule({
    declarations: [
        ListBlockCodesComponent,
        DialogViewBlockCodeDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(blockCodesRoutes),
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatCardModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatDialogModule,

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
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBqvItvk6cbioQiw-7sLVLAQihjPYIizXg'
          })
    ],
    providers: [
        { provide: GoogleMapsAPIWrapper, useClass: GoogleMapsAPIWrapper }
    ]
})
export class BlockCodesModule
{
}
