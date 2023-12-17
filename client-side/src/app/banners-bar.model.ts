import { PepHorizontalAlignment, PepSizeType, PepStyleType} from "@pepperi-addons/ngx-lib";
import { Page } from "@pepperi-addons/papi-sdk";
import { v4 as uuid } from 'uuid';

export type textColor = 'system-primary' | 'dimmed' | 'invert' | 'strong';
export type verticalAlignment = 'start' | 'middle' | 'end';
export type textPositionStyling = 'overlaid' | 'separated';
export type groupTitleAndDescription = 'grouped' | 'ungrouped';
export type iconPosition = 'start' | 'end';
export type titleStyle = 'body' | 'heading';
export type WidthType = 'dynamic' | 'set' | 'stretch';
export type ClickedArea = 'banner' | 'first-title' | 'second-title';
export type FontWeight = 'normal' | 'bold';
export class Alignment {
    Horizontal: PepHorizontalAlignment = 'left';
    Vertical: 'start' | 'middle' | 'end' = 'start';
}

export class BannerText {
    UseLabel: boolean = true;
    Label: string = '';
    Value: string = '';
}

export class Title {
    Use: boolean;
    Label: string;
    Style: titleStyle;
    Size: PepSizeType;
    FontWeight: FontWeight;

    constructor(Use = false, Label = '', Style: titleStyle = 'body', Size: PepSizeType = 'lg', FontWeight: FontWeight = 'bold'){
        this.Use = Use;
        this.Label = Label;
        this.Style = Style;
        this.Size = Size;
        this.FontWeight = FontWeight;
    }
}

export class Icon {
    UseIcon: boolean = false;
    Position: iconPosition = 'end';
    Url: string = '';
}

export interface IHostObject {
    state: any;
    configuration: IBanner;
    parameters: any;
    configurationSource: IBanner;
    pageConfiguration: any;
    page: Page,
}

export interface IBanner{
    BannerConfig: IBannerConfig,
    Banners: Array<BannerEditor>
}

export class Structure{
    MaxColumns: number = 2;
    Gap: PepSizeType = 'sm';
    Padding: PepSizeType = 'sm';
    BorderRadius: PepSizeType | 'none' = 'none';
}

export class IBannerConfig{
    Structure: Structure = new Structure();
    OnLoadFlow: any;
}

export class BannerEditor {
    id: number;
    FirstTitle: Title = new Title();
    SecondTitle: Title = new Title(false, '', 'body', 'sm', 'normal');
    Style: PepStyleType = 'weak';
    Color: textColor = 'system-primary';
    Icon: Icon = new Icon();
    ClickedArea: ClickedArea = 'banner';
    UseFlow: boolean = false;
    Flow: any;
    ButtonKey: string = uuid();
}
