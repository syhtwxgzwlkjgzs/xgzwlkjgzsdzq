const fs = require('fs'),
  util = require('util'),
  cp = require('child_process'),
  path = require('path');

(async () => {
  // 往dist目录中添加空文件进行已处理标记
  await new Promise((resolve) => {
    fs.exists("./dist/handled.txt", (exists) => {
      if (exists) {
        console.log('请勿重复执行！');
      } else {
        resolve();
      }
    });
  });

  // 删除主包中app.wxss最后一行的错误import
  const filename = './dist/app.wxss';
  const lines2nuke = 1;
  const command = util.format('tail -n %d %s', lines2nuke, filename);
  cp.exec(command, (err, stdout, stderr) => {
    if (err) throw err;
    var to_vanquish = stdout.length;
    fs.stat(filename, (err, stats) => {
      if (err) throw err;
      fs.truncate(filename, stats.size - to_vanquish, (err) => {
        if (err) throw err;
      })
    });
  });


  // 分包中的wxss文件添加对分包中common.wxss的引用
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
                const relativePath = path.relative(p, './dist/subPages/common.wxss');
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


  // 往dist目录中添加空文件进行标记
  fs.writeFile('./dist/handled.txt', '', (error) => {});
  console.log('dist目录处理成功，请在微信开发者工具中进行调试！');
})();
