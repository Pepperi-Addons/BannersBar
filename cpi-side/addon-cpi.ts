import '@pepperi-addons/cpi-node'
import BannerCpiService from './banner-cpi.service';
import * as _ from 'lodash'

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
    const configuration = req?.body?.Configuration;
    let configurationRes = configuration;
    const state = req.body.State;
    
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.BannerConfig?.OnLoadFlow){
        try{
            const cpiService = new BannerCpiService();
            //CALL TO FLOWS AND SET CONFIGURATION
            const result: any = await cpiService.getOptionsFromFlow(configuration.BannerConfig.OnLoadFlow || [], state, req.context, configuration);
            //allways return configuration (even if the flow don't)
            configurationRes = result?.configuration || configuration;
        }
        catch(err){
            configurationRes = configuration;
        }
    }

    res.json({
        State: state,
        Configuration: configurationRes
    });
});

router.post('/run_button_click_event', async (req, res) => {
    const state = req.body.State;
    const btnKey = req.body.ButtonKey;
    const configuration = req?.body?.Configuration;

    let configurationRes = null;
    const banner = configuration?.Banners?.filter(b => { return b.ButtonKey === btnKey })[0] || null;

    // check if flow configured to on load --> run flow (instaed of onload event)
    if (banner?.Flow){
        const cpiService = new BannerCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(banner.Flow || [], state, req.context, configuration);
        configurationRes = result?.configuration;
    }

    res.json({
        State: state,
        Configuration: configurationRes,
    });
});

router.post('/on_block_state_change', async (req, res) => {
    const state = req.body.State || {};
    const changes = req.body.Changes || {};

    const mergeState = {...state, ...changes};

    res.json({
        State: mergeState,
        Configuration: changes,
    });
});
