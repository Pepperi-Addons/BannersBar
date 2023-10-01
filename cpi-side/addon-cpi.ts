import '@pepperi-addons/cpi-node'
import BannerCpiService from './banner-cpi.service';

export async function load(configuration: any): Promise<void>{
    return Promise.resolve();
}

export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
})

router.post('/on_block_load', async (req, res) => {
    let configuration = req?.body?.Configuration;
    const state = req.body.State;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.BannerConfig?.OnLoadFlow){
        const cpiService = new BannerCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.BannerConfig.OnLoadFlow || [], state, req.context, configuration);
        configuration = result?.configuration || configuration;
    }

    res.json({Configuration: configuration});
});

router.post('/run_button_click_event', async (req, res) => {
    let configuration = req?.body?.Configuration;
    const state = req.body.State;
    const btnID = req.body.ButtonKey;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.Banners[btnID]?.Flow){
        const cpiService = new BannerCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.Banners[btnID].Flow || [], state, req.context, configuration);
        configuration = result?.configuration || configuration;
    }
    res.json({Configuration: configuration});
});


/**********************************  client events starts /**********************************/
// pepperi.events.intercept(CLIENT_ACTION_ON_BANNER_CLICK as any, {}, async (data): Promise<any> => {
//     const cpiService = new BannerCpiService();
//     const res: any = await cpiService.getOptionsFromFlow(data.flow, data.parameters, data, data.parameters.configuration);
//     return res;
// });
/***********************************  client events ends /***********************************/

