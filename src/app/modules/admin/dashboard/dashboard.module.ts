import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AgmCoreModule, GoogleMapsAPIWrapper, AgmMap, AgmDataLayer } from '@agm/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { SharedModule } from 'app/shared/shared.module';

import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';

const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    }
]

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        RouterModule.forChild(dashboardRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        PipesModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBqvItvk6cbioQiw-7sLVLAQihjPYIizXg'
          })
    ],
    providers: [
        { provide: GoogleMapsAPIWrapper, useClass: GoogleMapsAPIWrapper }
    ]
})
export class DashboardModule
{
}
