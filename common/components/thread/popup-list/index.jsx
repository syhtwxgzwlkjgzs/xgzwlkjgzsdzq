import React, { useContext, useState, useEffect, useRef } from 'react';
import { Tabs, Button, Icon, Popup } from '@discuzq/design';
import { ThreadCommonContext } from '../utils';
import data from './data';
import styles from './index.module.scss';

const Index = ({ visible, onHidden }) => {
    const { dispatch } = useContext(ThreadCommonContext)

    const tabList = useRef([
        {
            id: '0',
            label: '全部',
            badge: '0',
            icon: 'succuss'
        },
        {
            id: '1',
            label: '点赞',
            badge: '0',
            icon: 'succuss'
        },
        {
            id: '2',
            label: '打赏',
            badge: '0',
            icon: 'succuss'
        }
    ])

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setDataSource(data)
        }, 1000)
    }, [])

    const renderListItem = (item, index) => {
        return (
            <div className={styles.listItem} key={index}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <img className={styles.img} src={item.img}></img>
                        <div className={styles.icon} style={{backgroundColor: index%2 === 0 ? '#e02433' : '#ffc300'}}>
                            <Icon name={item.icon} />
                        </div>
                    </div>

                    <div className={styles.content}>
                        <span className={styles.title}>{item.name}</span>
                        <span className={styles.subTitle}>{item.time}</span>
                    </div>
                </div>
                
                <Button type="primary">查看主页</Button>
            </div>
        )
    } 

    const renderList = () => {
        return (
            <div className={styles.list}>
                {dataSource.map((item, index) => renderListItem(item, index))}
            </div>
        )
    }

    return (
        <Popup
            position="bottom"
            visible={visible}
            onClose={onHidden}
        >
            <Tabs>
                {tabList.current.map(item => (
                    <Tabs.TabPanel key={item.id} id={item.id} label={item.label} badge={item.badge} icon={item.icon}>
                    {renderList()}
                    </Tabs.TabPanel>
                ))}
            </Tabs>
        </Popup>
    )
}

export default React.memo(Index) 