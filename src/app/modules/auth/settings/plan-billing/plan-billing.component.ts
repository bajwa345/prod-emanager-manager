import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector       : 'settings-plan-billing',
    templateUrl    : './plan-billing.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPlanBillingComponent implements OnInit
{
    planBillingForm: FormGroup;
    plans: any[];

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder
    )
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
        // Create the form
        this.planBillingForm = this._formBuilder.group({
            plan          : ['basic'],
            cardHolder    : ['Usman Mehmood'],
            cardNumber    : [''],
            cardExpiration: [''],
            cardCVC       : [''],
            country       : ['pakistan'],
            zip           : ['']
        });

        // Setup the plans
        this.plans = [
            {
                value  : 'basic',
                label  : 'MPA',
                details: 'Package for a Provincial Assembly Candidate.',
                price  : '500000'
            },
            {
                value  : 'team',
                label  : 'MNA',
                details: 'Package for a National Assembly Candidate.',
                price  : '700000'
            },
            {
                value  : 'enterprise',
                label  : 'UC CHAIRMAN',
                details: 'Package for a Union Council Chairman.',
                price  : '200000'
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
