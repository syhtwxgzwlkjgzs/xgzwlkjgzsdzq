import React from 'react';
import { Menu, Card } from '@discuzq/design';

const Index = ({ categories }) => {
  const renderSubMenuTitle = ({ name, threadCount }) => (
    <div>
      <span>{name}</span>
      {threadCount !== 0 && <span style={{ cssFloat: 'right' }}>{threadCount}</span>}
    </div>
  );

  const CategoriesContent = () => (
      <Menu>
        {
          categories?.map((item, index) => (item?.children?.length > 0 ? (
              <Menu.SubMenu key={index} index={index} title={renderSubMenuTitle(item)}>
                {item.children.map((childrens, indexs) => (
                    <Menu.Item index={indexs} key={indexs}>{childrens.name}</Menu.Item>
                ))}
              </Menu.SubMenu>
          ) : (
                  <Menu.Item index={index} key={index}>{renderSubMenuTitle(item)}</Menu.Item>
          )))
        }
      </Menu>
  );

  return (
    <Card style={{ background: '#fff' }} bordered={false}>
      <CategoriesContent />
    </Card>
  );
};
export default React.memo(Index);
