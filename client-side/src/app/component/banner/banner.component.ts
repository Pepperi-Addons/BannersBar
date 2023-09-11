import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ButtonEditor }  from '../../banners-bar.model';

@Component({
    selector: 'banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

    @ViewChild('textCont') elementView: ElementRef;
    @Input() banner: ButtonEditor;
    @Output() bannerClick: EventEmitter<any> = new EventEmitter();

    constructor(
        private translate: TranslateService) {

    }

    async ngOnInit(): Promise<void> {

    }

    getTextContHeight(){
        return this.elementView?.nativeElement?.clientHeight || '56';
    }

    onTextClick(event){
        if(event?.srcElement?.classList?.value.indexOf(this.banner.ClickedArea) > -1){
            this.bannerClick.emit({'event': event, 'id': this.banner.id});
        }
    }
}
