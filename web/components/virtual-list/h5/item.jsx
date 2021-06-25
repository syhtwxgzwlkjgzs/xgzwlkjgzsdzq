import React, { useEffect, useRef } from 'react';
import ThreadContent from '@components/thread';
import { observer } from 'mobx-react';

export default observer((props) => {
  const { data } = props;

  const ref = useRef(null);

  useEffect(() => {
    props.measure();
  }, [ref?.current?.clientHeight]);

  return (
    <div ref={ref}>
      <ThreadContent
        onContentHeightChange={props.measure}
        onImageReady={props.measure}
        onVideoReady={props.measure}
        key={data.threadId}
        // showBottomStyle={index !== pageData.length - 1}
        data={data}
        // className={styles.listItem}
        recomputeRowHeights={(data) => props.recomputeRowHeights(data)}
      />
    </div>
  );
});
