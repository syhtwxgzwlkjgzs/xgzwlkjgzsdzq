import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Avatar, Button, Icon, Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import LoadingBox from '@components/loading-box';
import goToLoginPage from '@common/utils/go-to-login-page';
import classNames from 'classnames';
import calcCosImageQuality from '@common/utils/calc-cos-image-quality';
import styles from './index.module.scss';
import { usePopper } from 'react-popper';
import ReactDOM from 'react-dom';

function avatar(props) {
  const {
    direction = 'right',
    image = '',
    name = '匿',
    onClick = () => {},
    className = '',
    circle = true,
    size = 'primary',
    isShowUserInfo = false,
    userId = null,
    user: myself,
    search,
    userType = -1,
    unifyOnClick = null, // 付费加入，统一点击事件
    withStopPropagation = false, // 是否需要阻止冒泡 默认false不阻止
    level = 6,
  } = props;

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <>
      <button type="button" ref={setReferenceElement}>
        名称
      </button>

      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        Popper element
      </div>
    </>
  );
}
export default inject('user', 'search')(withRouter(avatar));
