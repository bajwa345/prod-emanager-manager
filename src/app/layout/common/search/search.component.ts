import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations/public-api';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;

@Component({
    selector     : 'search',
    templateUrl  : './search.component.html',
    encapsulation: ViewEncapsulation.None,
    exportAs     : 'fuseSearch',
    animations   : fuseAnimations
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy
{
    @Input() appearance: 'basic' | 'bar' = 'basic';
    @Input() debounce: number = 300;
    @Input() minLength: number = 4;
    @Output() search: EventEmitter<any> = new EventEmitter<any>();

    user: User;
    storageUrl = environment.storageUrl;
    opened: boolean = false;
    resultSets: any[];
    searchControl: FormControl = new FormControl('', [Validators.maxLength(15), this.validateInput]);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _elementRef: ElementRef,
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _renderer2: Renderer2
    )
    {
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any
    {
        return {
            'search-appearance-bar'  : this.appearance === 'bar',
            'search-appearance-basic': this.appearance === 'basic',
            'search-opened'          : this.opened
        };
    }

    /**
     * Setter for bar search input
     *
     * @param value
     */
    @ViewChild('barSearchInput')
    set barSearchInput(value: ElementRef)
    {
        // If the value exists, it means that the search input
        // is now in the DOM and we can focus on the input..
        if ( value )
        {
            // Give Angular time to complete the change detection cycle
            setTimeout(() => {

                // Focus to the input element
                value.nativeElement.focus();
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnChanges(changes: SimpleChanges): void
    {
        if ( 'appearance' in changes )
        {
            // To prevent any issues, close the
            // search after changing the appearance
            this.close();
        }
    }

    ngOnInit(): void
    {
        // Subscribe to the search field value changes
        this.searchControl.valueChanges
            .pipe(
                debounceTime(this.debounce),
                takeUntil(this._unsubscribeAll),
                map((value) => {

                    // Set the resultSets to null if there is no value or
                    // the length of the value is smaller than the minLength
                    // so the autocomplete panel can be closed
                    if ( !value || value.length < this.minLength )
                    {
                        this.resultSets = null;
                    }

                    // Continue
                    return value;
                }),
                // Filter out undefined/null/false statements and also
                // filter out the values that are smaller than minLength
                filter(value => value && value.length >= this.minLength)
            )
            .subscribe((value) => {
                this._httpClient.post(backEndUrl + '/common/search', {query: value.replace(/-/g, ''), ictype : this.user.level, icnumber : this.user.constituencyid.toString()})
                    .subscribe((resultSets: any) => {

                        // Store the result sets
                        this.resultSets = resultSets.items;

                        // Execute the event
                        this.search.next(resultSets);
                    });
            });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onKeydown(e: KeyboardEvent): void
    {
        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

        // Listen for escape to close the search, if the appearance is 'bar'
        if ( this.appearance === 'bar' ) {
            if ( e.code === 'Escape' ) {
                this.close(); // Close the search
            }
        }
    }

    onKeyup(event) {
        var valu = event.target.value;
    }

    validateInput(c: FormControl) {
        let MOBILE_NO_REGEX = /^[0-9]{4}-[0-9]{7}$/;
        let NIC_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

        return (MOBILE_NO_REGEX.test(c.value) || NIC_REGEX.test(c.value)) ? null : {
          validateInput: {
            valid: false
          }
        };
    }

    /**
     * Open the search
     * Used in 'bar'
     */
    open(): void
    {
        // Return if it's already opened
        if ( this.opened )
        {
            return;
        }

        // Open the search
        this.opened = true;
    }

    /**
     * Close the search
     * * Used in 'bar'
     */
    close(): void
    {
        // Return if it's already closed
        if ( !this.opened )
        {
            return;
        }

        // Clear the search input
        this.searchControl.setValue('');

        // Close the search
        this.opened = false;
    }

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
