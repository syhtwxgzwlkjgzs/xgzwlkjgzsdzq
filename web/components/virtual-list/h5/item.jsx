import React, { useEffect, useRef } from 'react';
import ThreadContent from '@components/thread';
import { observer } from 'mobx-react';

export default observer((props) => {
  const { data, isLast } = props;

  const ref = useRef(null);

  useEffect(() => {
    measure();
  }, [ref?.current?.clientHeight]);

  const measure = () => {
    typeof props.measure === 'function' && props.measure();
  };

  return (
    <div ref={ref}>
      <ThreadContent
        onContentHeightChange={measure}
        onImageReady={measure}
        onVideoReady={measure}
        key={data.threadId}
        showBottomStyle={!isLast}
        data={data}
        // className={styles.listItem}
        recomputeRowHeights={(data) => props.recomputeRowHeights(data)}
      />
    </div>
  );
});
