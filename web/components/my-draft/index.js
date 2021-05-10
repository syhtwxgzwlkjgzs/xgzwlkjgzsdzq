/**
 * 发帖页标题
 * @prop {function} deleteDraft 删除草稿事件
 * @prop {function} clickDraftTxt 点击进入编辑草稿事件
 * @prop {function} onRefresh 触底事件，需要传一个promise
 * 侧滑删除组件详情参考 https://github.com/sandstreamdev/react-swipeable-list
 */
import React, { memo, useState, useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import List from '@components/base-layout';
import ThreadCenterView from '@components/thread/ThreadCenterView';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const MyDrafts = ({ pc, index, deleteDraft, clickDraftTxt, onRefresh, ...props }) => {
    const [list, setList] = useState([]);

    useEffect(async () => {
        await index.getReadThreadList(); // 先用帖子数据模拟
        setList(index.threads.pageData)
    }, []);

    const deleteDrafts = (e) => { // 删除草稿事件
        deleteDraft(e)
        console.log('删除了', e)
    }
    const clickDraftTxts = (e) => {
        clickDraftTxt(e)
        console.log(`点击进入`, e)
    }
    const onRefreshs = () => {
        onRefresh()
        console.log('触底了')
    }

    return (
        <div className={styles.drafts_box}>
            {/* 草稿箱列表部分 */}
            <List className={styles.list} onRefresh={() => { onRefreshs() }} onPullDown={() => { console.log('下拉了') }} showPullDown={true}>
                {/* 显示草稿条数 */}
                <div className={styles.drafts_lenth}><span>{list.length} 条草稿</span></div>
                {/* 显示草稿条数结束 */}
                <div className={styles.drafts_listbox} >
                    {list.map((item, index) => {
                        return <SwipeableListItem swipeLeft={{
                            content: <div className={styles.drafts_delete}>删除</div>,
                            action: () => { deleteDrafts(item.postId) }
                        }} key={index}>
                            <div className={styles.drafts_list} onClick={() => clickDraftTxts(item.postId)}>
                                <ThreadCenterView data={item} />
                                <p className={styles.drafts_time}>{item.diffTime}</p>
                            </div>
                        </SwipeableListItem>
                    })}
                </div>
                {/* 草稿箱列表部分结束 */}
            </List>
        </div >
    );
};

MyDrafts.propTypes = {
    deleteDraft: PropTypes.func,
    clickDraftTxt: PropTypes.func,
    onRefresh: PropTypes.func,
};

// 设置props默认类型
MyDrafts.defaultProps = {
    deleteDraft: () => { },
    clickDraftTxt: () => { },
    onRefresh: () => { }, // 触底需要传一个pormise
};

export default inject('index')(observer(memo(MyDrafts)));
