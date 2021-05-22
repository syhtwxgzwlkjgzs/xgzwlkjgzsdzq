import React, { memo } from 'react';
import { inject } from 'mobx-react';
import DDialog from '@components/dialog';
import { Popup } from '@discuzq/design';

import styles from './index.module.scss';

@inject('site')
@inject('mapUrl')
@inject('onChange')
@inject('onClose')
class MapDialog extends React.Component {
  constructor(props) {
    super(props)

    this.setLocation = this.setLocation.bind(this)
  }

  render() {
    const { site: { isPC } } = this.props;

    if (isPC) {
      return (
        <DDialog
          pc
          visible={true}
          className={styles.dialog}
          onClose={this.props.onClose}
          title="你在哪里？"
          isCustomBtn={true}
        >
          <iframe src={this.props.mapUrl} frameBorder="0" scrolling="no" />
        </DDialog>
      );
    }

    return (
      <Popup
        className={styles.popup}
        position="center"
        visible={true}
      >
        <iframe src={this.props.mapUrl} frameBorder="0" scrolling="no" />
      </Popup>
    );
  }

  setLocation(event) {
    const { data } = event
    if (data && data.module === 'locationPicker') {
      const { cityname, poiname, poiaddress, latlng: { lat, lng } } = data;
      const position = {
        longitude: lng,
        latitude: lat,
        cityname: cityname,
        address: poiaddress,
        location: poiname
      }
      this.props.onChange(position)
      this.props.onClose()
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.setLocation, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.setLocation)
  }
};

export default memo(MapDialog);