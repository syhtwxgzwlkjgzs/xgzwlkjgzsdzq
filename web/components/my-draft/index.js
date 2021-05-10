/**
 * 发帖页标题
 * @prop {string} title 输入标题值
 * @prop {string} placeholder
 * @prop {boolean} isDisplay 是否显示标题
 * @prop {function} onChange change事件，输出当前标题值
 */
import React, { memo, useState, useEffect, useRef } from 'react';
import Header from '@components/header';
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import List from '@components/list';
import { PullToRefresh } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const MyDrafts = ({pc, ...props }) => {
    // state 标题值
    const listRef = useRef(null);
    const [list, setList] = useState([{ id: 1, title: '运行dzq只适合带宽按量付的云服务器', span: '编辑于 2分钟前' }, { id: 2, title: 'Users你好，你的注册申请已审核通过', span: '编辑于 2021-3-19' }, { id: 3, title: 'pc+h5问答类型 #主题# ，就是暂时不支持二级分类，等待官方升级，欢迎体验。', span: '编辑于 2021-3-16' }, { id: 4, title: '运行dzq只适合带宽按量付的云服务器', span: '编辑于 2分钟前' }, { id: 5, title: '运行dzq只适合带宽按量付的云服务器', span: '编辑于 2分钟前' }, { id: 6, title: '运行dzq只适合带宽按量付的云服务器', span: '编辑于 2分钟前' }, { id: 7, title: '运行dzq只适合带宽按量付的云服务器', span: '编辑于 2分钟前' }, { id: 8, title: '运行dzq只适合带宽按量付的云服务器', span: '编辑于 2分钟前' }, { id: 9, title: '运行dzq只适合带宽按量付的云服务器', span: '编辑于 2分钟前' },]);

    const [refresh, setRefresh] = useState(true);
    const onRefresh = () => {
        setRefresh(false);
    };

    const deleteDraft = (e) => { // 删除草稿事件
        console.log('删除了', e)
    }
    const clickDraftTxt = (e) => {
        console.log(`点击进入`, e)
    }
    const onScroll = () => {
        const el = listRef.current.offsetTop;
        console.log('滚动了', el);
    }

    return (
        <div className={styles.drafts_box}>
            {/* 头部 */}
            <Header isBackCustom={() => { this.props.handleSetState({ draftShow: true }); return false; }} />
            {/* 头部结束 */}
            {/* 草稿箱列表部分 */}
            <List className={styles.list} onScroll={onScroll} allowRefresh={false} onRefresh={() => { console.log('触底了'); }}>
                {/* 显示草稿条数 */}
                <div className={styles.drafts_lenth}><span>{list.length} 条草稿</span></div>
                {/* 显示草稿条数结束 */}

                <div className={styles.drafts_listbox} ref={listRef}>
                    {list.map((item, index) => {
                        return <SwipeableListItem swipeLeft={{
                            content: <div className={styles.drafts_delete}>删除</div>,
                            action: () => { deleteDraft(item.id) }
                        }} key={index}>
                            <div className={styles.drafts_list} onClick={() => clickDraftTxt(item.id)}>
                                <p className={styles.drafts_p}>{item.title}</p>
                                <p className={styles.drafts_time}>{item.span}</p>
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
    // title: PropTypes.string,
    // isDisplay: PropTypes.bool,
    // placeholder: PropTypes.string,
    // onChange: PropTypes.func,
    // onFocus: PropTypes.func,
    // onBlur: PropTypes.func,
};

// 设置props默认类型
MyDrafts.defaultProps = {
    // title: '',
    // isDisplay: false,
    // placeholder: '标题(可选)',
    // onChange: () => { },
    // onFocus: () => { },
    // onBlur: () => { },
};

export default memo(MyDrafts);
