import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'settings-contactus',
    templateUrl    : './contactus.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsContactUsComponent implements OnInit
{
    members: any[];
    roles: any[];

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Setup the team members
        this.members = [
            {
                avatar  : 'assets/images/avatars/male.png',
                name    : 'Usman Bajwa',
                mobile  : '0300-7769960',
                email   : 'bajwa345@gmail.com'
            },
            //{
            //    avatar  : 'assets/images/avatars/male.png',
            //    name    : 'Ali Abbas',
            //    mobile  : '0300-9486483'
            //},
            {
                name    : 'Fahad Lodhi',
                mobile  : '0320-4059089',
                mobile2 : ''
            }
        ];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
