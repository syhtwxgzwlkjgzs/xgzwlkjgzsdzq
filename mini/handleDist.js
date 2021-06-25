const fs = require('fs'),
  path = require('path');
const miniConfig = require('./src/app.config');

(async () => {


  // 删除主包中app.wxss最后一行的错误import
  const filename = './dist/app.wxss';
  const str = fs.readFileSync(filename, 'utf8');
  fs.writeFileSync(filename, str.replace('@import "./subPages/common.wxss";', ''), 'utf8');


  // 给没有index.wxss的子页面创建index.wxss文件
  const subPages = miniConfig.subPackages[0].pages;
  subPages.forEach((page) => {
    const subPageWxss = `./dist/subPages/${page.substring(0, page.length - 6)}/index.wxss`;
    try {
      fs.accessSync(subPageWxss);
    } catch(e) {
      fs.writeFile(subPageWxss, '', (error) => {});
      console.log(`${subPageWxss} 成功创建！`)
    }
  });


  // 分包子页面中的wxss文件添加对分包中common.wxss的引用
  function subPagesAddWxss(url) {
    const ext = '.wxss';
    fs.readdir(url, function (err, files) {
      if (err) {
        return console.log(err);
      }
      files.forEach((file) => {
        const p = url + file;
        fs.stat(p, (err, stats) => {
          if (err) {
            return console.log(err);
          }
          if (stats.isFile()) {
            if (path.extname(p) === ext) {
              if (p !== './dist/subPages/common.wxss') {
                const data = fs.readFileSync(p, 'utf8').split(/\r\n|\n|\r/gm);
                const relativePath = path.relative(p, './dist/subPages/common.wxss').replace(/\\/g, '/');
                data.push(`@import '${relativePath.replace('../', '')}';`);
                fs.writeFileSync(p, data.join('\r\n'))
              }
            }
          } else if (stats.isDirectory()) {
            subPagesAddWxss(p + '/');
          }
        });
      });
    });
  }
  subPagesAddWxss('./dist/subPages/');

  console.log('dist目录处理成功，请在微信开发者工具中进行调试！');
})();
