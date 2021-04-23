import React from 'react';
import style from './index.module.scss';
import { Menu, Card } from '@discuzq/design';
import categories from './data';

const Index = () => {
  const title = (name = '全部') => {
    return (
      <div>
        <span>{name}</span>
        <span style={{float: 'right'}}>{Math.ceil(Math.random()*1000)}</span>
      </div>
    )
  }
  const CategoriesContent = () => {
    return (
      <Menu>
        <Menu.Item index="3">{title('全部')}</Menu.Item>
        {categories?.map((item, index) => {
          if (item.children && item.children.length > 0) {
            return (
              <Menu.SubMenu index={index} title={title(item.name)}>
                {item.children.map((childrens, indexs) => {
                  return (
                    <Menu.Item index={indexs}>{childrens.name}</Menu.Item>
                  )
                })}
              </Menu.SubMenu>
            )
          } else {
            return (
              <Menu.Item index={index}>{title(item.name)}</Menu.Item>
            )
          }
        })}
      </Menu>
    )
  }
  return (
    <Card style={{ background: '#fff' }} bordered={false}>
      <CategoriesContent />
    </Card>
  )
}
export default React.memo(Index)