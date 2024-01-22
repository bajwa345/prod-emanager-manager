import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'landing-home',
    styleUrls    : ['./home.component.scss'],
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent
{
    languageUrdu = false;

    constructor()
    {
    }

    changedLanguage(){
    }
}
