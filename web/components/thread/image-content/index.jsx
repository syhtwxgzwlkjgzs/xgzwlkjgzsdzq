import React from 'react';
import { inject, observer } from 'mobx-react';
import H5Page from './h5';
import PCPage from './pc';

@inject('site')
@observer
class Index extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {site} = this.props;
        const {platform} = site;
        console.log(platform, 'platform')
        if ( platform === 'pc' ) {
            return <PCPage {...this.props}/>;
        }

        return <H5Page {...this.props}/>;
    }
} 

export default React.memo(Index);