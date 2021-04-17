import React from 'react';
import { inject, observer } from 'mobx-react';
import H5Header from './h5';
import PCHeader from './pc';

@inject('site')
@observer
class Header extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {

        const {site} = this.props;
        const {platform} = site;

        if ( platform === 'pc' ) {
            return <PCHeader/>;
        }else {
            return <H5Header/>;
        }
    }
} 

export default Header;