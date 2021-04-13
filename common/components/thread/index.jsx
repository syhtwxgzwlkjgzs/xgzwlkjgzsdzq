import React from 'react';
import { inject, observer } from 'mobx-react';
import { ThreadCommonContext } from './utils';
import Tip from './tip';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {

    dispatch = (type, data) => {
        console.log(type);
    }

    render() {
        return (
            <ThreadCommonContext.Provider value={{ dispatch: this.dispatch }}>
                <Tip />
            </ThreadCommonContext.Provider>
        )
    }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);