import React from 'react';
import classnames from 'classnames';

/**
 *
 * example:
```js
const columns = [
  {
    title: '123',
    key: '',
    render: item => item.money,
  },
  {
    title: '234',
    key: '',
    render: (item) => {},
  },
  {
    title: '345',
    key: '',
    render: (item) => {},
  },
];
```
 * @param {*} param0
 * @returns
 */
function RenderList({ columns = [], data = [], className = '' }) {
  const titles = columns.map(item => item.title);

  return (
    <div className={classnames('renderList', className)}>
      <div
        className={'listTitleWrapper'}
        style={{
          display: 'flex',
        }}
      >
        {titles.map(title => (
          <div
            key={title}
            className={'listTitle'}
            style={{
              width: `${100 / columns.length}%`,
            }}
          >
            {title}
          </div>
        ))}
      </div>
      <div className={'listItemWrapper'}>
        {data.map((item, idx) => (
          <div
            key={idx}
            className={'listItem'}
            style={{
              display: 'flex',
            }}
          >
            {columns.map(column => (
              <div
                className={'listColumn'}
                key={`${column.key} + ${idx}`}
                style={{
                  width: `${100 / columns.length}%`,
                }}
              >
                {column.render(item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RenderList;
