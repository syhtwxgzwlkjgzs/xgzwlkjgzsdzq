/* eslint-disable */
// <p>&lt;p&gt;111&lt;/p&gt;</p>
import getConfig from '@common/config';
export const tags = {
  topic: text => {
    if (!text) return;
    const regexp = /<span\s*id="topic"\s*value="(?<value>\w+)"\s*>(?<string>[^<]+)<\/span>/gimu;
    return text.replace(regexp, match => {
      return match.replace(regexp, (content, value, text) => {
        const href = `/topic/topic-detail/${value}`;
        return `<a href="${href}" class="content-topic a-blue">${text}</a> `;
      });
    });
  },
  usermention: text => {
    if (!text) return;
    const regexp = /<span\s*id="member"\s*value="(?<value>\w+)"\s*>(?<string>[^<]+)<\/span>/gimu;
    return text.replace(regexp, match => {
      return match.replace(regexp, (content, value, text) => {
        const href = `/user/${value}`;
        return `<a href="${href}" class="content-member a-blue">${text}</a> `;
      });
    });
  },
  parseHtml1: text => { // 恢复 <
    if (!text) return;
    const regexp = /&lt;/gimu;
    return text.replace(regexp, match => {
      return match.replace(regexp, (content, value, text) => {
        return `<`;
      });
    });
  },
  parseHtml2: text => {  // 恢复 >
    if (!text) return;
    const regexp = /&gt;/gimu;
    return text.replace(regexp, match => {
      return match.replace(regexp, (content, value, text) => {
        return `>`;
      });
    });
  },
  emotion: text => {  // 转义表情
    if (!text) return;
    const regexp = /:(?<value>[0-9A-Za-z]{2,20}):/gimu;
    return text.replace(regexp, match => {
      return match.replace(regexp, (content, value, text) => {
       const config = getConfig() || {}
       // 获取域名
       const url = config.COMMON_BASE_URL || window.location.origin
       return `<img style="display:inline-block;vertical-align:top" src="${url}/emoji/qq/${value}.gif" alt="${value}" class="qq-emotion">`;
      });
    });
  },
};
function parse(text) {
  for (const tag in tags) {
    text = tags[tag](text);
  }

  return text;
}

export default { parse };
