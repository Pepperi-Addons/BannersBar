import { PepHorizontalAlignment, PepSizeType, PepStyleType} from "@pepperi-addons/ngx-lib";
import { PepIconType } from "@pepperi-addons/ngx-lib/icon";
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

export class ButtonIcon {
    UseIcon: boolean = false;
    Position: iconPosition = 'end';
    Url: string = '';
}

export interface IHostObject {
    configuration: IButtonsBar;
    parameters: any;
}

export interface IButtonsBar{
    ButtonsBarConfig: IButtonsBarConfig,
    Buttons: Array<ButtonEditor>
}

export class Structure{
    MaxColumns: number = 2;
    Gap: PepSizeType = 'sm';
    Padding: PepSizeType = 'sm';
    BorderRadius: PepSizeType | 'none' = 'none';
    //WidthType: WidthType = 'set';
    //Width: number = 8; // rem
    //Size: PepSizeType = 'md';
    //Alignment: Alignment = new Alignment();
}

// export class Button {
//     Height: number = 16;
//     TextColor: textColor = 'system-primary';
//     Border: PepColorSettings = new PepColorSettings();
//     DropShadow: PepShadowSettings = new PepShadowSettings();
//     UseRoundCorners: boolean = true;
//     RoundCornersSize: PepSizeType = 'md';
// }

export class IButtonsBarConfig{
    Structure: Structure = new Structure();
    OnLoadFlow: any;
}

export class ButtonEditor {
    id: number;
    FirstTitle: Title = new Title();
    SecondTitle: Title = new Title();
    Style: PepStyleType = 'weak';
    Color: string = 'system-primary';
    Icon: ButtonIcon = new ButtonIcon();
    ClickedArea: ClickedArea = 'banner';
    /*Title: string = "defaultTitle";
    Description: string = "defaultDescription";
    AssetKey: string = '';
    AssetURL: string = '';*/
    Flow: any;
}
