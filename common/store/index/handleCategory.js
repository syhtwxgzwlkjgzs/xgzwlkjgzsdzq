import oo from '../../utils/typeof'
// 获取选中的分类名称
export const getCategoryName = (categories, categoryIds) => {
    if (!isNull(categories, categoryIds)) {
      const id = categoryIds[0]
      if (id !== 'all') {
        let name = ''
        categories.forEach(item => {
          if (`${item.pid}` === `${id}`) {
            name = item.name
          } else {
            if (item.children?.length) {
                // 在一级分类中没有找到，再从二级分类中找
                item.children.forEach(children => {
                    if (`${children.pid}` === `${id}`) {
                        name = children.name
                    }
                })
            }
          }
        })
        return name
      }
    }
    return ''
}

export const resetCategoryIds = (id) => {
    return id === 'all' || id === 'default' ? '' : id;
}

// 获取当前被激活的一级分类pid
export const getActiveId = (categories, categoryIds) => {
    if (isNull(categories, categoryIds)) {
        return ''
    }

    const id = categoryIds[0]
    // 如果categoryIds中的元素有多个，那应该是一级分类被选中了
    if (categoryIds?.length > 1) {
        return id
    }
    const newId = this.resetCategoryIds(id);
    if (newId) {
        // 确定id是否是二级分类，如果是二级分类，则返回一级分类的pid
        categories.forEach((item) => {
            if (item.children?.length) {
            const tmp = item.children.filter(children => children.pid === newId);
            if (tmp.length) {
                newCurrentIndex = item.pid;
            }
            }
        });
    }
    return newCurrentIndex;
  }

  const isNull = (categories, categoryIds) => {
      return oo.isArray(categories) && categories?.length && oo.isArray(categoryIds) && categoryIds?.length
  }