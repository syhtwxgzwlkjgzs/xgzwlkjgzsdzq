import router from 'next/router';

// https://www.nextjs.cn/docs/api-reference/next/router#routerpush
class WebRouter {
  _options = {
    scroll: true,
    shallow: true,
  }
  router = router;
  push(url, as, options = {}) {
    this.router.push(url, as, { ...this._options, ...options });
  }
  replace(url, as, options = {}) {
    this.router.replace(url, as, { ...this._options, ...options });
  }
  // 预读取页面，只对没有Link标签包裹的路径有效
  prefetch(url, as) {
    this.router.prefetch(url, as);
  }
  beforePopState(cb) {
    this.router.beforePopState(cb);
  }
  back() {
    this.router.back();
  }
  redirect(url, ops = {}) {
    if (ops.res) {
      ops.res.writeHead(ops.status || 302, { Location: url });
      ops.res.end();
    } else {
      this.replace(url, '', {});
    }
  }
}

export default new WebRouter();
