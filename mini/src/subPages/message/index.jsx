import React from 'react';
import { inject, observer } from 'mobx-react';
import Page from '@components/page';
import Message from '@layout/message';

const Index = inject('site')(observer(() => {
  return (
    <Page>
      <Message />
    </Page>
  );
}));

export default Index;