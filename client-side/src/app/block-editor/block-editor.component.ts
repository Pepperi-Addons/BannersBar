import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { BannerBarService } from 'src/services/banner-bar.service';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { IBanner, BannerEditor, IBannerConfig } from '../banners-bar.model';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { FlowService } from 'src/services/flow.service';
import { Page, PageConfiguration } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    
    @Input()
    set hostObject(value: any) {
        if (value && value.configuration && Object.keys(value.configuration).length) {
                this._configuration = value.configuration;
                if(value.configurationSource && Object.keys(value.configuration).length > 0){
                    this.configurationSource = value.configurationSource;
                }
                //prepare the flow host hobject
                this.flowHostObject = this.flowService.prepareFlowHostObject((this.configuration?.BannerConfig?.OnLoadFlow || null)); 
        } else {
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }

        this.initPageConfiguration(value?.pageConfiguration);
        this._page = value?.page;
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);
    }

    private _page: Page;
    get page(): Page {
        return this._page;
    }

    public configurationSource: IBanner;
    private _configuration: IBanner;
    get configuration(): IBanner {
        return this._configuration;
    }

    private defaultPageConfiguration: PageConfiguration = { "Parameters": []};
    private _pageConfiguration: PageConfiguration = this.defaultPageConfiguration;
    private blockLoaded = false;
    
    public selectedBanner: number = -1;
    public flowHostObject;
    
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private bannerBarService: BannerBarService,
                private flowService: FlowService) {
        
    }

    async ngOnInit(): Promise<void> {

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

    private getDefaultHostObject(): IBanner {
        return { BannerConfig: new IBannerConfig(), Banners: this.getDefaultBanners(2) };
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
            }
            if(event.action === 'set-configuration-field'){
                this.updateHostObjectField(event.key, event.value);
            }
            // Update page configuration only if updatePageConfiguration
            if (event.updatePageConfiguration) { // TODO - CHECK IF NEED
                this.updatePageConfigurationObject();
            }
        }
    }
    private getDefaultBanners(numOfCards: number = 0): Array<BannerEditor> {
        let banners: Array<BannerEditor> = [];
       
        for(var i=0; i < numOfCards; i++){
            let btn = new BannerEditor();
            btn.id = i;
            
            btn.FirstTitle.Label = this.getOrdinal(i+1) + this.translate.instant('EDITOR.GENERAL.BANNER');
            
            banners.push(btn);
        }

        return banners;
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
        this.selectedBanner = this.selectedBanner === event.id ? -1 :  parseInt(event.id);
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
        this.updatePageConfigurationObject();
    }

    onBannerFlowChanged(event: any) {
        this.updatePageConfigurationObject();
    }

    private initPageConfiguration(value: PageConfiguration = null) {
        this._pageConfiguration = value || JSON.parse(JSON.stringify(this.defaultPageConfiguration));
    }

    private updatePageConfigurationObject() {
        this.initPageConfiguration();
    
        // Get the consume parameters keys from the filters.
        const consumeParametersKeys = this.getConsumeParametersKeys();
        this.addParametersToPageConfiguration(consumeParametersKeys, false, true);
        
        // After adding the params to the page configuration need to recalculate the page parameters.
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);

        this.emitSetPageConfiguration();
    }

    private getConsumeParametersKeys(): Map<string, string> {
        const parametersKeys = new Map<string, string>();

        // Move on all load flows
        const onLoadFlow = this.configuration?.BannerConfig?.OnLoadFlow || null;
        if (onLoadFlow) {
            let flowParams = JSON.parse(atob(onLoadFlow)).FlowParams;
            Object.keys(flowParams).forEach(key => {
                const param = flowParams[key];
                if (param.Source === 'Dynamic') {
                    parametersKeys.set(param.Value, param.Value);
                }
            });
        }
        
        // Move on all the buttons flows.
        for (let index = 0; index < this.configuration?.Banners?.length; index++) {
            const bnr = this.configuration.Banners[index];
            if (bnr?.Flow) {
                let flowParams = JSON.parse(atob(bnr.Flow)).FlowParams || null;
                Object.keys(flowParams).forEach(key => {
                    const param = flowParams[key];
                    if (param.Source === 'Dynamic') {
                        parametersKeys.set(param.Value, param.Value);
                    }
                });
            }
        }

        return parametersKeys;
    }

    private addParametersToPageConfiguration(paramsMap: Map<string, string>, isProduce: boolean, isConsume: boolean) {
        const params = Array.from(paramsMap.values());

        // Add the parameters to page configuration.
        for (let index = 0; index < params.length; index++) {
            const parameterKey = params[index];
            if(parameterKey !== 'configuration'){
                const paramIndex = this._pageConfiguration.Parameters.findIndex(param => param.Key === parameterKey);

                // If the parameter exist, update the consume/produce.
                if (paramIndex >= 0) {
                    this._pageConfiguration.Parameters[paramIndex].Consume = this._pageConfiguration.Parameters[paramIndex].Consume || isConsume;
                    this._pageConfiguration.Parameters[paramIndex].Produce = this._pageConfiguration.Parameters[paramIndex].Produce || isProduce;
                } else {
                    // Add the parameter only if not exist.
                    this._pageConfiguration.Parameters.push({
                        Key: parameterKey,
                        Type: 'String',
                        Consume: isConsume,
                        Produce: isProduce
                    });
                }
            }
        }
    }

    private emitSetPageConfiguration() {
        this.hostEvents.emit({
            action: 'set-page-configuration',
            pageConfiguration: this._pageConfiguration
        });
    }
    /***************   FLOW AND CONSUMER PARAMETERS END   ********************************/
}
