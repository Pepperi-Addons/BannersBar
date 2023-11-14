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

    private registerStateChange(data: {state: any, configuration: any}) {
        this.configuration = data.configuration;
    }

    onBannerClick(event, bannerID){
        // check if clicked on selected clicket area (from the editor)
        if(event?.srcElement?.classList?.value.indexOf(this.configuration.Banners[bannerID].ClickedArea) > -1 || this.configuration.Banners[bannerID].ClickedArea === 'banner'){
            if(this.configuration.Banners[bannerID].UseFlow && this.configuration.Banners[bannerID].Flow){
                this.hostEvents.emit({
                    action: 'button-click',
                    buttonKey: this.configuration.Banners[bannerID].ButtonKey
                })
            }
        } 
    }
}
