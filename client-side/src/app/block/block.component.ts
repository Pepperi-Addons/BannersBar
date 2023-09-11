import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IButtonsBar, IHostObject } from '../banners-bar.model';
import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';


@Component({
    selector: 'page-block', 
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {


    
    @Input() 
    set hostObject(value: IHostObject){
        this.configuration = value?.configuration;
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    private _configuration: IButtonsBar;
    get configuration(): IButtonsBar {
        return this._configuration;
    }
    set configuration(conf: IButtonsBar){
        this._configuration = conf;    
    }


    public columnTemplate: string;
    public imageMaxHeight: string;

    constructor(private translate: TranslateService) {
    
    }

    @HostListener('window:resize')
    public onWindowResize() {
    }
    
    ngOnInit(): void {
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

  
    onButtonClick(event){

       const flowData = event.Flow || null;
       const parameters = {
            ButtonConfiguration: event
        }
        if(flowData){
        // Parse the params if exist.
        // const params = this.getScriptParams(event.ScriptData); 
            try{
                const eventData = {
                    detail: {
                        eventKey: CLIENT_ACTION_ON_BUTTONS_BAR_CLICK,
                        eventData: { flow: flowData, parameters: parameters },
                        completion: (res: any) => {
                                if (res?.configuration && Object.keys(res.configuration).length > 0) {
                                    this.configuration.Buttons[event.id] = {...this.configuration.Buttons[event.id], ...res.configuration};
                                } else {
                                    // Show default error.
                                }
                            }
                    }
                };

                const customEvent = new CustomEvent('emit-event', eventData);
                window.dispatchEvent(customEvent);
            }
            catch(err){

            }
        }
    }

    onBannerClick(event, bannerID){
        if(event?.srcElement?.classList?.value.indexOf(this.configuration.Buttons[bannerID].ClickedArea) > -1 || this.configuration.Buttons[bannerID].ClickedArea === 'banner'){
            alert('clicked');
        }
    //    if(this.configuration.Buttons[bannerID].ClickedArea === 'banner'){
    //     alert('banner clicked');
    //    }
    //    else if(this.configuration.Buttons[bannerID].ClickedArea === 'first-title'){
    //     alert('first title clicked');
    //    }
    //    else if(this.configuration.Buttons[bannerID].ClickedArea === 'second-title'){
    //     alert('second title clicked');
    //    }
       //else if(event?.srcElement?.classList?.value.indexOf('banner-container') > -1 && )
    }

    onBannerTextClick(event){
        //this.onBannerClick(event.event, event.id);
    }
}
