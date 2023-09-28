import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { BannerModule } from '../component/banner/banner.module'
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { BannerComponent } from './index';
import { config } from '../app.config';
import { PepIconModule, PepIconRegistry, pepIconArrowDown, pepIconBarndPepperi } from '@pepperi-addons/ngx-lib/icon';
import { MatIconModule } from '@angular/material/icon';

const pepIcons = [
    pepIconArrowDown,
    pepIconBarndPepperi
]
export const routes: Routes = [
    {
        path: '',
        component: BannerComponent
    }
];

@NgModule({
    declarations: [BannerComponent],
    imports: [
        CommonModule,
        PepButtonModule,
        PepIconModule,
        MatIconModule,
        BannerModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [BannerComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class BannerModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService,
        private pepIconRegistry: PepIconRegistry)
        {
            this.pepIconRegistry.registerIcons(pepIcons);
            this.pepAddonService.setDefaultTranslateLang(translate);
        }
}
