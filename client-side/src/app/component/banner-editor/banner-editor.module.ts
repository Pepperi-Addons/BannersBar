import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerEditorComponent } from './banner-editor.component'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepSliderModule} from '@pepperi-addons/ngx-lib/slider';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { MatDialogModule } from '@angular/material/dialog';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { PepIconPickerModule } from '@pepperi-addons/ngx-composite-lib/icon-picker';
import { PepFlowPickerButtonModule } from '@pepperi-addons/ngx-composite-lib/flow-picker-button';
import { PepFieldTitleModule } from '@pepperi-addons/ngx-lib/field-title';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { config } from '../../app.config';
import { PepIconRegistry, pepIconSystemBin, pepIconSystemMove, pepIconArrowBack, pepIconArrowBackRight, pepIconArrowDown, pepIconArrowDownAlt, pepIconArrowBackLeft, pepIconArrowEither, pepIconArrowLeft, pepIconArrowLeftAlt, pepIconArrowRight,pepIconArrowRightAlt, pepIconArrowTwoWaysHorL} from '@pepperi-addons/ngx-lib/icon';

const pepIcons = [
    pepIconSystemBin,
    pepIconSystemMove,
    pepIconArrowBack,
    pepIconArrowBackRight,
    pepIconArrowDown, 
    pepIconArrowDownAlt,
    pepIconArrowBackLeft, pepIconArrowEither, pepIconArrowLeft, pepIconArrowLeftAlt, pepIconArrowRight,pepIconArrowRightAlt
]
@NgModule({
    declarations: [BannerEditorComponent],
    imports: [
        CommonModule,
        DragDropModule,
        PepButtonModule,
        PepMenuModule,
        PepTextboxModule,
        PepCheckboxModule,
        PepSliderModule,
        PepNgxLibModule,
        PepSelectModule,
        MatDialogModule,
        PepGroupButtonsModule,
        PepColorModule,
        PepGroupButtonsSettingsModule,
        PepNgxCompositeLibModule,
        PepIconPickerModule,
        PepFlowPickerButtonModule,
        PepFieldTitleModule,
        PepTextareaModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [BannerEditorComponent]
})
export class BannerEditorModule {
    constructor(
        private pepIconRegistry: PepIconRegistry,
    ) {
        this.pepIconRegistry.registerIcons(pepIcons);
    }
}
