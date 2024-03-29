import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},

    // Redirect signed in user to the '/dashboard'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            //{path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            //{path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            //{path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)},
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule)},
            {path: 'list-voters', loadChildren: () => import('app/modules/admin/voters/voters.module').then(m => m.VotersModule)},
            {path: 'list-pollinglocations', loadChildren: () => import('app/modules/admin/pollinglocations/pollinglocations.module').then(m => m.PollingLocationsModule)},
            {path: 'list-pollingstations', loadChildren: () => import('app/modules/admin/pollingstations/pollingstations.module').then(m => m.PollingStationsModule)},
            {path: 'list-blockcodes', loadChildren: () => import('app/modules/admin/blockcodes/blockcodes.module').then(m => m.BlockCodesModule)},
            {path: 'list-pollingagents', loadChildren: () => import('app/modules/admin/pollingagents/pollingagents.module').then(m => m.PollingAgentsModule)},
            {path: 'search-voter', loadChildren: () => import('app/modules/admin/searchvoter/searchvoter.module').then(m => m.SearchVoterModule)},
            {path: 'reports', loadChildren: () => import('app/modules/reports/reports.module').then(m => m.ReportsModule)},
            {path: 'result-compilation', loadChildren: () => import('app/modules/admin/resultcompilation/resultcompilation.module').then(m => m.ResultCompilationModule)},
            {path: 'list-politicalworkers', loadChildren: () => import('app/modules/admin/politicalworkers/politicalworkers.module').then(m => m.PoliticalWorkersModule)},
            {path: 'list-appusers', loadChildren: () => import('app/modules/admin/appusers/appusers.module').then(m => m.AppUsersModule)},
            {path: 'settings', loadChildren: () => import('app/modules/auth/settings/settings.module').then(m => m.SettingsModule)}
        ]
    }
];
