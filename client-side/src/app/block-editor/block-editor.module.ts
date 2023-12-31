import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { BlockEditorComponent } from './index';
import { BannerEditorModule } from '../component/banner-editor/banner-editor.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepSliderModule } from '@pepperi-addons/ngx-lib/slider';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { FlowService } from '../../services/flow.service';
import { PepFlowPickerButtonModule } from '@pepperi-addons/ngx-composite-lib/flow-picker-button';
import { PepFieldTitleModule } from '@pepperi-addons/ngx-lib/field-title';
import { config } from '../app.config';

@NgModule({
    declarations: [BlockEditorComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        BannerEditorModule,
        DragDropModule,
        PepSliderModule,
        PepGroupButtonsModule,
        PepNgxCompositeLibModule,
        PepGroupButtonsSettingsModule,
        PepTextboxModule,
        PepButtonModule,
        PepFlowPickerButtonModule,
        PepFieldTitleModule,
        
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [BlockEditorComponent],
    providers: [
        TranslateStore,
        FlowService
        // Add here all used services.
    ]
})
export class BlockEditorModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
