import React from 'react'
import UserCenterEditPayPwd from '../../../../components/user-center-edit-paypwd/index'
import { View } from '@tarojs/components';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';

export default function index() {
  return (
    <ToastProvider>
      <View>
        <UserCenterEditPayPwd />
      </View>
    </ToastProvider>
  )
}
