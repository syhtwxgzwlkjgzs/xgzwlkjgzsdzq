import React from 'react';
import { View } from '@tarojs/components';
// import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Page from '@components/page';
import UserCenterEditPayPwd from '../../../../components/user-center-edit-paypwd/index';

export default function index() {
  return (
    // <ToastProvider>
    <Page>
        <UserCenterEditPayPwd />
    </Page>
    // </ToastProvider>
  );
}
