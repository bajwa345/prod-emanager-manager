import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnicPipe } from './cnic.pipe';
import { MobilePipe } from './mobile.pipe';


@NgModule( {
    declarations: [
        CnicPipe,
        MobilePipe
    ],
    exports: [
        CnicPipe,
        MobilePipe
    ],
    imports: [
        CommonModule
    ]
} )
export class PipesModule { }
