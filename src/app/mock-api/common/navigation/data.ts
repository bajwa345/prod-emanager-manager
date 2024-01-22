/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    },
    {
        id   : 'list-voters',
        title: 'Electoral Voters',
        type : 'basic',
        icon : 'heroicons_outline:ticket',
        link : '/list-voters'
    },
    {
        id   : 'list-blockcodes',
        title: 'Census Blockcodes',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/list-blockcodes'
    },
    {
        id   : 'list-pollingstations',
        title: 'Polling Stations',
        type : 'basic',
        icon : 'heroicons_outline:office-building',
        link : '/list-pollingstations'
    },
    {
        id   : 'list-pollinglocations',
        title: 'Polling Locations',
        type : 'basic',
        icon : 'heroicons_outline:library',
        link : '/list-pollinglocations'
    },
    {
        id   : 'search-voter',
        title: 'Search Voter',
        type : 'basic',
        icon : 'heroicons_outline:search-circle',
        link : '/search-voter'
    },
    {
        id   : 'reports',
        title: 'Reports',
        type : 'collapsable',
        icon : 'heroicons_outline:document-report',
        children: [
            {
                id   : 'reports.polling-scheme-report',
                title: 'Polling Scheme Report',
                type : 'basic',
                link : '/reports/polling-scheme-report'
            },
            {
                id   : 'reports.transport-incharge-report',
                title: 'Transport Incharge Report',
                type : 'basic',
                link : '/reports/transport-incharge-report'
            },
            {
                id   : 'reports.food-incharge-report',
                title: 'Food Incharge Report',
                type : 'basic',
                link : '/reports/food-incharge-report'
            },
            {
                id   : 'reports.voter-reachability-report',
                title: 'Voter Reachability Report',
                type : 'basic',
                link : '/reports/voter-reachability-report'
            },
            {
                id   : 'reports.workers-campaign-report',
                title: 'Workers Campaign Report',
                type : 'basic',
                link : '/reports/workers-campaign-report'
            }
        ]
    },
    {
        id   : 'list-pollingagents',
        title: 'Polling Agents',
        type : 'basic',
        icon : 'heroicons_outline:identification',
        link : '/list-pollingagents'
    },
    {
        id   : 'result-compilation',
        title: 'Result Compilation',
        type : 'basic',
        icon : 'heroicons_outline:speakerphone',
        link : '/result-compilation'
    },
    {
        id   : 'list-politicalworkers',
        title: 'Political Workers',
        type : 'basic',
        icon : 'heroicons_outline:flag',
        link : '/list-politicalworkers'
    },
    {
        id   : 'list-appusers',
        title: 'Application Users',
        type : 'basic',
        icon : 'heroicons_outline:users',
        link : '/list-appusers'
    }
];
export const compactNavigation: FuseNavigationItem[] = [];
export const futuristicNavigation: FuseNavigationItem[] = [];
export const horizontalNavigation: FuseNavigationItem[] = [];
