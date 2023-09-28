import { PepHorizontalAlignment, PepSizeType, PepStyleType} from "@pepperi-addons/ngx-lib";
import { Page } from "@pepperi-addons/papi-sdk";

export type textColor = 'system-primary' | 'dimmed' | 'invert' | 'strong';
export type verticalAlignment = 'start' | 'middle' | 'end';
export type textPositionStyling = 'overlaid' | 'separated';
export type groupTitleAndDescription = 'grouped' | 'ungrouped';
export type iconPosition = 'start' | 'end';
export type titleStyle = 'body' | 'heading';
export type WidthType = 'dynamic' | 'set' | 'stretch';
export type ClickedArea = 'banner' | 'first-title' | 'second-title';
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
    Use: boolean = false;
    Label: string = '';
    Style: titleStyle = 'body';
    Size: PepSizeType = 'lg';
}

export class Icon {
    UseIcon: boolean = false;
    Position: iconPosition = 'end';
    Url: string = '';
}

export interface IHostObject {
    configuration: IBanner;
    parameters: any;
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
    SecondTitle: Title = new Title();
    Style: PepStyleType = 'weak';
    Color: string = 'system-primary';
    Icon: Icon = new Icon();
    ClickedArea: ClickedArea = 'banner';
    UseFlow: boolean = false;
    Flow: any;
}

export interface IEditorHostObject {
    state: any;
    configuration: IBanner;
    configurationSource: IBanner;
    pageConfiguration: any;
    page: Page
}
