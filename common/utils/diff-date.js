import Time from '@discuzq/sdk/dist/time';

export const diffDate = function (time, referenceTime) {
  if (!time) Time.formatDate(new Date(), 'yyyy-MM-dd');

  // 格式化，兼容苹果系统
  time = Time.formatDate(time, 'YYYY/MM/DD HH:mm:ss');

  const timestamp = new Date(time).getTime();
  const refTimestamp = referenceTime ? new Date(referenceTime).getTime() : Date.now();

  const diffTimestamp = refTimestamp - timestamp;
  const diffSenconds = Math.floor(diffTimestamp / 1000);
  const diffMinutes = Math.floor(diffSenconds / 60);
  const diffHours = Math.floor(diffSenconds / 3600);
  const diffDays = Math.floor(diffSenconds / 86400);

  if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
    return `${diffSenconds || 1}秒前`;
  }

  if (diffDays === 0 && diffHours === 0) {
    return `${diffMinutes}分钟前`;
  }

  if (diffDays === 0) {
    return `${diffHours}小时前`;
  }

  return Time.formatDate(time, 'YYYY-MM-DD');
};
