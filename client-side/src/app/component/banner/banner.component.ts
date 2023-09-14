import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BannerEditor }  from '../../banners-bar.model';

@Component({
    selector: 'banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

    @ViewChild('textCont') elementView: ElementRef;
    @Input() banner: BannerEditor;

    constructor(
        private translate: TranslateService) {

    }

    async ngOnInit(): Promise<void> {

    }

    getTextContHeight(){
        return this.elementView?.nativeElement?.clientHeight || '56';
    }
}
