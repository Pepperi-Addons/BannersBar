import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepColorService} from '@pepperi-addons/ngx-lib';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { ButtonEditor }  from '../../banners-bar.model';
import { FlowService } from '../../../services/flow.service';

interface groupButtonArray {
    key: string; 
    value: string;
}

@Component({
    selector: 'button-editor',
    templateUrl: './button-editor.component.html',
    styleUrls: ['./button-editor.component.scss']
})
export class ButtonEditorComponent implements OnInit {

    @Input() configuration: ButtonEditor;
    @Input() 
    set configurationSource(value: any) {
        this.configuration = value;
    }
    //configurationSource: ButtonEditor;
    @Input() id: number;
    @Input() selectedButton: number;

    private _pageParameters: any = {};
    @Input()
    set pageParameters(value: any) {
        this._pageParameters = value;
    }

    public title: string;

    @Input() isDraggable = false;
    @Input() showActions = true;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() editClick: EventEmitter<any> = new EventEmitter();
    
    bannerStyle: Array<PepButton> = [];
    clickedAreas: Array<PepButton> = [];
    bannerColor: Array<PepButton> = [];
   

    iconPosition: Array<PepButton> = [];
    textStyle: Array<PepButton> = [];
    secTextStyle: Array<PepButton> = [];
    consumersList: Array<PepButton> = [];
    public flowHostObject;

    constructor(
        private translate: TranslateService,
        private flowService: FlowService) {

    }

    async ngOnInit(): Promise<void> {

        this.bannerStyle = [
            { key: 'strong', value: this.translate.instant('EDITOR.CONTENT.STYLES.STRONG')},
            { key: 'regular', value: this.translate.instant('EDITOR.CONTENT.STYLES.REGULAR')},
            { key: 'weak', value: this.translate.instant('EDITOR.CONTENT.STYLES.WEAK')}
        ];
        
        this.bannerColor = [
            { key: 'system-primary', value: this.translate.instant('EDITOR.CONTENT.COLOR.TYPE.SYSTEM') },
            { key: 'system-primary-invert', value: this.translate.instant('EDITOR.CONTENT.COLOR.TYPE.SYSTEM_INVERT') },
            { key: 'user-primary', value: this.translate.instant('EDITOR.CONTENT.COLOR.TYPE.PRIMARY') },
            { key: 'user-secondary', value: this.translate.instant('EDITOR.CONTENT.COLOR.TYPE.SECONDARY') }
        ]

        this.clickedAreas = [
            { key: 'banner', value: this.translate.instant('EDITOR.CONTENT.CLICKED_AREA.BANNER')},
            { key: 'first-title', value: this.translate.instant('EDITOR.CONTENT.CLICKED_AREA.FIRST_TITLE')},
            { key: 'second-title', value: this.translate.instant('EDITOR.CONTENT.CLICKED_AREA.SECOND_TITLE')}
        ]

        this.iconPosition = [
            { key: 'start', value: this.translate.instant('EDITOR.CONTENT.ICON.POSITION.START'), callback: (event: any) => this.onFieldChange('Icon.Position',event) },
            { key: 'end', value: this.translate.instant('EDITOR.CONTENT.ICON.POSITION.END'), callback: (event: any) => this.onFieldChange('Icon.Position',event) }
        ];

        this.textStyle = [
            { key: 'body', value: this.translate.instant('EDITOR.CONTENT.TITLE_STYLE.BODY'), callback: (event: any) => this.onFieldChange('FirstTitle.Style',event) },
            { key: 'heading', value: this.translate.instant('EDITOR.CONTENT.TITLE_STYLE.HEADING'), callback: (event: any) => this.onFieldChange('FirstTitle.Style',event) }
        ];

        this.secTextStyle = [
            { key: 'body', value: this.translate.instant('EDITOR.CONTENT.TITLE_STYLE.BODY'), callback: (event: any) => this.onFieldChange('SecondTitle.Style',event) },
            { key: 'heading', value: this.translate.instant('EDITOR.CONTENT.TITLE_STYLE.HEADING'), callback: (event: any) => this.onFieldChange('SecondTitle.Style',event) }
        ];

    }

    ngAfterViewInit(): void {
        this.flowHostObject = this.flowService.prepareFlowHostObject((this.configuration?.Flow || null)); 
    }

    getOrdinal(n) {
        var s = ["th ", "st ", "nd ", "rd "]; 
        var v = n%100;
        return n + (s[(v-20)%10] || s[v] || s[0]);
    }

    onRemoveClick() {
        this.removeClick.emit({id: this.id});
    }

    onEditClick() {
        this.editClick.emit({id: this.id});
    }

    onFieldChange(key, event){
        const value = key.indexOf('image') > -1 && key.indexOf('src') > -1 ? event.fileStr :  event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration[keyObj[0]][keyObj[1]] = value;
            this.updateHostObjectField(`Buttons[${this.id}][${keyObj[0]}][${keyObj[1]}]`, value);
        }
        else{
            this.configuration[key] = value;
            this.updateHostObjectField(`Buttons[${this.id}][${key}]`, value);
            
        }
    }

    private updateHostObject(updatePageConfiguration = false) {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration,
            updatePageConfiguration: updatePageConfiguration
        });
    }

    private updateHostObjectField(fieldKey: string, value: any) {
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey, 
            value: value
        });
    }

    onSlideshowFieldChange(key, event){/*
        if(event && event.source && event.source.key){
            this.configuration.GalleryConfig[key] = event.source.key;
        }
        else{
            this.configuration.GalleryConfig[key] = event;
        }

        this.updateHostObject();*/
    }

    onHostEvents(event: any) {/*
        if(event?.url) {
            this.configuration.Cards[this.id].AssetURL = "'"+ encodeURI(event.url) +"'";
            this.configuration.Cards[this.id].AssetKey = event.key;

            this.updateHostObject();
        }     */
    }

    // openFlowPickerDialog() {
    //     const flow = this.configuration?.Flow  ?  JSON.parse(atob(this.configuration.Flow)) : null;
    //     let hostObj = {};
    //     if(flow){
    //         hostObj = { 
    //             runFlowData: { 
    //                 FlowKey: flow.FlowKey, 
    //                 FlowParams: flow.FlowParams 
    //             },
    //             fields: {
    //                 ButtonConfiguration: {
    //                     Type: 'Object',
    //                 }
    //             }
    //         };
    //     } else{
    //         hostObj = { 
    //             fields: {
    //                 ButtonConfiguration: {
    //                         Type: 'Object',
    //                     }
    //                 },
    //             }
    //     }

    //     this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
    //         container: this.viewContainerRef,
    //         name: 'FlowPicker',
    //         size: 'large',
    //         hostObject: hostObj,
    //         hostEventsCallback: async (event) => {
    //             if (event.action === 'on-done') {
    //                     const base64Flow = btoa(JSON.stringify(event.data));
    //                     this.configuration['Flow'] = base64Flow;
    //                     this.updateHostObjectField(`Buttons[${this.id}]['Flow']`, base64Flow);
    //                     this.dialogRef.close();
    //                     this.btnFlowName = await this.bannerBarService.getFlowName(event.data.FlowKey) || undefined;
    //             } else if (event.action === 'on-cancel') {
    //                     this.dialogRef.close();
    //             }
    //         }
    //     })

    // }

    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));
        this.configuration['Flow'] = base64Flow;
        this.updateHostObjectField(`Buttons[${this.id}]['Flow']`, base64Flow);
    }

    onIconChange(event){
        this.configuration.Icon.Url = event.url;
        this.onFieldChange('Icon.Url', event?.url );
    }

    onUseIconChange(event: boolean){
        this.onFieldChange('Icon.UseIcon',event);
    }



}
