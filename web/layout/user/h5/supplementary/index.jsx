import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Checkbox, Radio, Upload, Button, Icon, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { getSignInFields } from '@server';

import { InputType, CreateFunctions } from './components';

@inject('site')
@inject('user')
@inject('thread')
@inject('supplementary')
@observer
class SupplementaryH5Page extends React.Component {
  async componentDidMount() {
    try {
      const res = await getSignInFields();
      const fields = res.data;
      console.log(fields);
      this.props.supplementary.fields = fields;
      this.props.supplementary.values = fields?.map(() => (''));
    } catch (e) {
      console.log(e);
      Toast.error({
        content: e,
        duration: 2000,
      });
    }
  }

  createComponent(field) {
    field.onChange = this.onChange;
    const f = CreateFunctions[field.type];
    if (!f) return (<></>);
    return f(field);
  }

  onChange = (index, value) => {
    const { values } = this.props.supplementary;
    values[index] = value;
  };

  render() {
    const { fields, values } = this.props.supplementary;
    console.log(fields);
    return (
      <div className={layout.content}>
        {values.map((item, index) => this.createComponent({ ...(fields[index]), index, values }))}
        <Button className={layout.button} type='primary' onClick={() => {
          console.log(values);
        }}>
          提交
        </Button>
      </div>
    );
  }
}

export default withRouter(SupplementaryH5Page);
