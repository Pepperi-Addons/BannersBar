import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IBanner, IHostObject } from '../banners-bar.model';

@Component({
    selector: 'page-block', 
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {

    @Input() 
    set hostObject(value: IHostObject){
        if(value?.configuration && Object.keys(value.configuration).length){
            this.configuration = value?.configuration;
        }
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    private _configuration: IBanner;
    get configuration(): IBanner {
        return this._configuration;
    }
    set configuration(conf: IBanner){
        this._configuration = conf;    
    }

    public columnTemplate: string;
    public imageMaxHeight: string;

    constructor(private translate: TranslateService) {}

    @HostListener('window:resize')
    public onWindowResize() {
    }
    
    ngOnInit(): void {
        this.hostEvents.emit({
            action: 'register-state-change',
            callback: this.registerStateChange.bind(this)
        });
    }

    ngAfterViewInit(){
        // if(this.elementView.nativeElement){
        //     this.imageMaxHeight = this.elementView.nativeElement.clientHeight || '56';
        // }
     }
    ngOnChanges(e: any): void {
        // if(this.elementView.nativeElement){
        //     this.imageMaxHeight = this.elementView.nativeElement.clientHeight || '56';
        // }
    }
    private registerStateChange(data: {state: any, configuration: any}) {
        debugger;
        this.configuration = data.configuration;
    }

    onBannerClick(event, bannerID){
        if(event?.srcElement?.classList?.value.indexOf(this.configuration.Banners[bannerID].ClickedArea) > -1 || this.configuration.Banners[bannerID].ClickedArea === 'banner'){
            if(this.configuration.Banners[bannerID].UseFlow && this.configuration.Banners[bannerID].Flow){
                this.hostEvents.emit({
                    action: 'button-click',
                    buttonKey: bannerID
                })
            }
        } 
    }
  
    // onBannerClick2(event, bannerID){
        
    // if(event?.srcElement?.classList?.value.indexOf(this.configuration.Banners[bannerID].ClickedArea) > -1 || this.configuration.Banners[bannerID].ClickedArea === 'banner'){

    //     const flowData = this.configuration.Banners[bannerID].Flow || null;
    //     const parameters = {
    //             configuration: this.configuration
    //             //: this.configuration.Banners[bannerID]
    //     }
    //     if(flowData){
    //         // Parse the params if exist.
    //         // const params = this.getScriptParams(event.ScriptData); 
    //             try{
    //                 const eventData = {
    //                     detail: {
    //                         eventKey: CLIENT_ACTION_ON_BANNER_CLICK,
    //                         eventData: { flow: flowData, parameters: parameters },
    //                         completion: (res: any) => {
    //                                 if (res?.configuration && Object.keys(res.configuration).length > 0) {
    //                                     this.configuration.Banners[bannerID] = {...this.configuration.Banners[bannerID], ...res.configuration};
    //                                 } else {
    //                                     // Show default error.
    //                                 }
    //                             }
    //                     }
    //                 };

    //                 const customEvent = new CustomEvent('emit-event', eventData);
    //                 window.dispatchEvent(customEvent);
    //             }
    //             catch(err){

    //             }
    //         }
    //     }
    // }

    // onBannerClick(event, bannerID){
    //     if(event?.srcElement?.classList?.value.indexOf(this.configuration.Banners[bannerID].ClickedArea) > -1 || this.configuration.Banners[bannerID].ClickedArea === 'banner'){
    //         this.onButtonClick(bannerID);
    //     }
    // }

    // onBannerTextClick(event){
    //     this.onBannerClick(event.event, event.id);
    // }
}
