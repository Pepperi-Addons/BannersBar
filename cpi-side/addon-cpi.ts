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
        const cpiService = new BannerCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.BannerConfig.OnLoadFlow || [], state, req.context, configuration);
        configurationRes = result?.configuration || configuration;
    }

    const difference = _.differenceWith(_.toPairs(configurationRes), _.toPairs(configuration), _.isEqual);
    difference.forEach(diff => {
        state[diff[0]] = diff[1];
    });

    res.json({
        State: state,
        Configuration: configurationRes,
    });
});

router.post('/run_button_click_event', async (req, res) => {
    const state = req.body.State;
    const btnID = req.body.ButtonKey;
    const configuration = req?.body?.Configuration;

    for (const prop in configuration) {
        // skip loop if the property dont exits on state object
        if (state.hasOwnProperty(prop)) {
            //update configuration with the object from state
            configuration[prop] = state[prop];
        }
    }

    let configurationRes = configuration;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.Banners[btnID]?.Flow){
        const cpiService = new BannerCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.Banners[btnID].Flow || [], state, req.context, configuration);
        configurationRes = result?.configuration || configuration;
    }
    const difference = _.differenceWith(_.toPairs(configurationRes), _.toPairs(configuration), _.isEqual);
    difference.forEach(diff => {
        state[diff[0]] = diff[1];
    });

    res.json({
        State: state,
        Configuration: configurationRes,
    });
});

router.post('/on_block_state_change', async (req, res) => {
    const state = req.body.State || {};
    const changes = req.body.Changes || {};
    //const configuration = req.body.Configuration;

    const mergeState = {...state, ...changes};

    res.json({
        State: mergeState,
        Configuration: changes,
    });
});
