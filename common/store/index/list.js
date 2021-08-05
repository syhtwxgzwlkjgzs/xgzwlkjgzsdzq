import { observable, computed, action } from 'mobx';
import { readThreadList } from '@server';

// 定义统一的 list 数据结构
export default class ListStore {
    // 所有的 list 集合数据存储
    @observable lists = {};

    @action
    registerList = ({
      namespace,
    }) => {
      if (this.lists[namespace]) return;
      this.lists[namespace] = {
        data: {},
        requestError: {
          isError: false,
          errorText: '加载失败',
        },
        attribs: {},
      };
    }

    /**
     * 获取指定命名空间的 list
     * @param {*} param0
     * @returns
     */
    @action
    getList = ({ namespace }) => {
      if (!this.lists[namespace]) {
        this.registerList({ namespace });
      }
      return this.lists[namespace];
    }

    /**
     * 请求获取 list
     * @param {*} param0
     */
    @action
    fetchList = async ({ namespace, filter = {}, sequence = 0, perPage = 10, page = 1 }) => {
      const newFilter = filter;
      if (filter.categoryids && (filter.categoryids instanceof Array)) {
        const newCategoryIds = filter.categoryids?.filter(item => item);
        if (!newCategoryIds.length) {
          delete newFilter.categoryids;
        }
      }
      const result = await readThreadList({ params: { perPage, page, filter: newFilter, sequence } });
      if (result.code === 0 && result.data) {
        return result;
      }
      this.setListRequestError({ namespace, errorText: result?.msg || '' });

      return Promise.reject(result?.msg || '');
    }


    /**
     * 设置列表错误
     * @param {*} param0
     * @returns
     */
    @action
    setListRequestError = ({ namespace, errorText }) => {
      if (!this.lists[namespace]) return;
      this.lists[namespace].requestError.isError = true;
      this.lists[namespace].requestError.errorText = errorText;
    }


    /**
     * 更新列表
     * @param {*} param0
     * @returns
     */
    @action
    updateList = ({ namespace, updater }) => {
      if (!this.lists[namespace]) return;
      if (updater) {
        this.lists[namespace] = updater(this.lists[namespace]);
      }
    }


    /**
     * 初始化列表
     * @param {*} param0
     */
    @action
    initList = ({ namespace, data }) => {
      if (!this.lists[namespace]) {
        this.registerList({ namespace });
      }

      this.lists[namespace].data = data;
    }

    /**
     * 获取所有的列表
     * @returns
     */
    @action
    getAllLists = () => this.lists;


    /**
     * 设置附加属性
     * @param {*} param0
     * @returns
     */
    @action
    setAttribute = ({ namespace, key, value }) => {
      if (!this.lists[namespace]) return;

      this.lists[namespace].attribs[key] = value;
    }


    /**
     * 获取指定的附加属性
     * @param {*} param0
     * @returns
     */
    getAttribute = ({ namespace, key }) => {
      if (!this.lists[namespace]) return null;

      return this.lists[namespace].attribs[key];
    }
}
