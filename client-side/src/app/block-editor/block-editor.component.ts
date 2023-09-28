import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { BannerBarService } from 'src/services/banner-bar.service';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { IBanner, BannerEditor, IBannerConfig, IEditorHostObject } from '../banners-bar.model';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { FlowService } from 'src/services/flow.service';
import { Page, PageConfiguration } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BannerEditorComponent implements OnInit {
    
    @Input()
    set hostObject(value: IEditorHostObject) {
        debugger;
        if (value && value.configuration && Object.keys(value.configuration).length) {
                this._configuration = value.configuration;
                if(value.configurationSource && Object.keys(value.configuration).length > 0){
                    this.configurationSource = value.configurationSource;
                }
        } else {
            // TODO - NEED TO ADD DEFAULT CARD
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }
        
        this.initPageConfiguration(value?.pageConfiguration);
        this._page = value?.page;
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);

        this.flowHostObject = this.flowService.prepareFlowHostObject((this.configuration?.BannerConfig?.OnLoadFlow || null)); 
        debugger;
    }

    private _page: Page;
    get page(): Page {
        return this._page;
    }
    
    private _configuration: IBanner;
    get configuration(): IBanner {
        return this._configuration;
    }

    private defaultPageConfiguration: PageConfiguration = { "Parameters": []};
    private _pageConfiguration: PageConfiguration;
    private blockLoaded = false;
    public configurationSource: IBanner;
    //public widthTypes: Array<PepButton> = [];
    //public verticalAlign : Array<PepButton> = [];
    public selectedButton: number = -1;
    public flowHostObject;
    
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private bannerBarService: BannerBarService,
                private flowService: FlowService) {
        
    }

    async ngOnInit(): Promise<void> {
        debugger;
        this.bannerBarService.pageParameterOptionsSubject$.subscribe((options) => {
            //this.pageParameterOptions = options;
        });

        const desktopTitle = await this.translate.get('EDITOR.GENERAL.COLOR.COLOR').toPromise();
        
        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }
        
        this.blockLoaded = true;
    }

    async ngOnChanges(e: any): Promise<void> {
       
    }

    onFieldChange(key, event){
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
 
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.BannerConfig.Structure[keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.BannerConfig.Structure[key] = value;
        }
  
        this.updateHostObjectField(`BannerConfig.Structure.${key}`, value);
    }

    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
        this.flowHostObject = this.flowService.prepareFlowHostObject((this.configuration?.BannerConfig?.OnLoadFlow || null)); 
    }

    private initPageConfiguration(value: PageConfiguration = null) {
        this._pageConfiguration = value || JSON.parse(JSON.stringify(this.defaultPageConfiguration));
    }

    private getDefaultHostObject(): IBanner {
        return { BannerConfig: new IBannerConfig(), Banners: this.getDefaultButtons(2) };
    }

    private updateHostObject() {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }

    private updateHostObjectField(fieldKey: string, value: any) {
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey, 
            value: value
        });
    }

    public onHostObjectChange(event) {
        if(event && event.action) {
            if (event.action === 'set-configuration') {
                this._configuration = event.configuration;
                this.updateHostObject();

                // Update page configuration only if updatePageConfiguration
                if (event.updatePageConfiguration) { // TODO - CHECK IF NEED
                    //this.updatePageConfigurationObject();
                }
            }
            if(event.action === 'set-configuration-field'){
                this.updateHostObjectField(event.key, event.value);
            }
        }
    }
    private getDefaultButtons(numOfCards: number = 0): Array<BannerEditor> {
        let buttons: Array<BannerEditor> = [];
       
        for(var i=0; i < numOfCards; i++){
            let btn = new BannerEditor();
            btn.id = i;
            
            
            btn.FirstTitle.Label = this.getOrdinal(i+1) + this.translate.instant('EDITOR.GENERAL.BANNER');

            //card.Description = this.translate.instant('GALLERY_EDITOR.AWESOMETEXTFORTHE') + ' ' + this.getOrdinal(i+1) + this.translate.instant('GALLERY_EDITOR.ITEM');
            buttons.push(btn);
        }

        return buttons;
    }

    getOrdinal(n) {
        var s = ["th ", "st ", "nd ", "rd "];
        var v = n%100;
        return n + (s[(v-20)%10] || s[v] || s[0]);
    }

    addNewButtonClick() {
        let btn = new BannerEditor();
        btn.id = (this.configuration?.Banners.length);
        btn.FirstTitle.Label = this.getOrdinal(btn.id+1) + this.translate.instant('EDITOR.GENERAL.BANNER');
        
        this.configuration?.Banners.push(btn);
        this.updateHostObject();  
    }

    onButtonEditClick(event){
        this.selectedButton = this.selectedButton === event.id ? -1 :  parseInt(event.id);
    }

    onButtonDuplicateClick(event){
        let btn = new BannerEditor();
        btn = JSON.parse(JSON.stringify(this.configuration.Banners[event.id]));
        //btn = {...btn,...this.configuration.Banners[event.id]  };
        btn.id = (this.configuration?.Banners.length);
        this.configuration?.Banners.push(btn);
        this._configuration = this.configuration
        this.updateHostObject();  
    }
    onButtonRemoveClick(event){
       this.configuration?.Banners.splice(event.id, 1);
       this.configuration?.Banners.forEach(function(btn, index, arr) {btn.id = index; });
       this.updateHostObject();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
         moveItemInArray(this.configuration.Banners, event.previousIndex, event.currentIndex);
         for(let index = 0 ; index < this.configuration.Banners.length; index++){
            this.configuration.Banners[index].id = index;
         }
          this.updateHostObject();
        } 
    }

    onDragStart(event: CdkDragStart) {
        this.bannerBarService.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        this.bannerBarService.changeCursorOnDragStart();
    }

    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));
        this.configuration.BannerConfig.OnLoadFlow = base64Flow;
        this.updateHostObjectField(`BannerConfig.OnLoadFlow`, base64Flow);
    }
}
