import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgxMaskModule } from 'ngx-mask';
import { MatCardModule } from '@angular/material/card';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
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

import { PollingSchemeReportComponent } from './pollingscheme/pollingscheme.component';
import { VoterReachabilityReportComponent } from './voterreachability/voterreachability.component';
import { TransportInchargeReportComponent } from './transportincharge/transportincharge.component';
import { DialogNewUpdateTransportDetailsComponent } from "./transportincharge/dialog-new-update-transport-details/dialognewupdatetransportdetails.component";
import { FoodInchargeReportComponent } from './foodincharge/foodincharge.component';
import { DialogNewUpdateFoodDetailsComponent } from "./foodincharge/dialog-new-update-food-details/dialognewupdatefooddetails.component";
import { WorkersCampaignReportComponent } from './workerscampaign/workerscampaign.component';
import { ChangeRequestsReportComponent } from './changerequests/changerequests.component';
import { DialogNewChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-new-changerequest/dialognewchangerequest.component';
import { DialogViewChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-view-changerequest/dialogviewchangerequest.component';
import { DialogUpdateChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-update-changerequest/dialogupdatechangerequest.component';
import { DialogProgressChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-progress-changerequest/dialogprogresschangerequest.component';
import { DialogDeleteChangeRequestComponent } from 'app/modules/reports/changerequests/dialog-delete-changerequest/dialogdeletechangerequest.component';

const reportsRoutes: Route[] = [
    {
        path     : 'polling-scheme-report',
        component: PollingSchemeReportComponent
    },
    {
        path     : 'transport-incharge-report',
        component: TransportInchargeReportComponent
    },
    {
        path     : 'food-incharge-report',
        component: FoodInchargeReportComponent
    },
    {
        path     : 'voter-reachability-report',
        component: VoterReachabilityReportComponent
    },
    {
        path     : 'workers-campaign-report',
        component: WorkersCampaignReportComponent
    },
    {
        path     : 'change-requests-report',
        component: ChangeRequestsReportComponent
    }
];

@NgModule({
    declarations: [
        PollingSchemeReportComponent,
        VoterReachabilityReportComponent,
        TransportInchargeReportComponent,
        WorkersCampaignReportComponent,
        FoodInchargeReportComponent,
        ChangeRequestsReportComponent,
        DialogNewUpdateTransportDetailsComponent,
        DialogNewUpdateFoodDetailsComponent,
        DialogNewChangeRequestComponent,
        DialogViewChangeRequestComponent,
        DialogUpdateChangeRequestComponent,
        DialogProgressChangeRequestComponent,
        DialogDeleteChangeRequestComponent
    ],
    imports: [
        RouterModule.forChild(reportsRoutes),
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatCardModule,
        MatPaginatorModule,
        MatProgressBarModule,
        FuseScrollbarModule,
        MatProgressSpinnerModule,
        FuseAlertModule,

        MatDatepickerModule,
        MatMomentDateModule,
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
        NgxExtendedPdfViewerModule,
        SharedModule,
        PipesModule,
        NgxMaskModule.forRoot()
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class ReportsModule
{
}
