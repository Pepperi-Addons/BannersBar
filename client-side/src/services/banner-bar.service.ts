import jwt from 'jwt-decode';
import { Injectable } from "@angular/core";
import { IPepOption, PepColorService } from "@pepperi-addons/ngx-lib";
import { PapiClient, SchemeFieldType } from '@pepperi-addons/papi-sdk';
import {  PepSessionService } from '@pepperi-addons/ngx-lib';
import { config } from '../app/app.config';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BannerBarService {
    
    papiClient: PapiClient
    accessToken = '';
    parsedToken: any
    papiBaseURL = ''

    constructor(private pepColorService: PepColorService,
                public session: PepSessionService
                /*private httpService: PepHttpService*/) {
                    const accessToken = this.session.getIdpToken();
                    this.parsedToken = jwt(accessToken);
                    this.papiBaseURL = this.parsedToken["pepperi.baseurl"];

                    this.papiClient = new PapiClient({
                        baseURL: this.papiBaseURL,
                        token: this.session.getIdpToken(),
                        addonUUID: config.AddonUUID,
                        suppressLogging:true
                        //addonSecretKey: client.AddonSecretKey,
                        //actionUUID: client.AddonUUID
                    });
                }
    
     async getFlowName(flowKey){
        let flowName = undefined;
        try{
            const flow = (await this.papiClient.userDefinedFlows.search({ KeyList: [flowKey], Fields: ['Key', 'Name']})).Objects;
            flowName = flow?.length ? flow[0].Name : undefined;
        }
        catch(err){
            flowName = undefined;
        }
        finally{
            return flowName;
        }
     }

     changeCursorOnDragStart() {
        document.body.classList.add('inheritCursors');
        document.body.style.cursor = 'grabbing';
    }

    changeCursorOnDragEnd() {
        document.body.classList.remove('inheritCursors');
        document.body.style.cursor = 'unset';
    }

        /******************************** FLOW SERVICES *****************************************/

       // This subject is for load page parameter options on the filter editor (Usage only in edit mode).
       private _pageParameterOptionsSubject: BehaviorSubject<Array<IPepOption>> = new BehaviorSubject<Array<IPepOption>>([]);
       get pageParameterOptionsSubject$(): Observable<Array<IPepOption>> {
           return this._pageParameterOptionsSubject.asObservable().pipe(distinctUntilChanged());
       }
   
       // This subjects is for dynamic parameters in Options source flow (Usage only in edit mode).
       private _flowDynamicParameters = new Map<string, SchemeFieldType>();
       get flowDynamicParameters(): ReadonlyMap<string, SchemeFieldType> {
           return this._flowDynamicParameters;
       }




}
