import { formatDate } from './format-date';

export const diffDate = function (time, referenceTime) {
  if (!time) formatDate(new Date(), 'yyyy-MM-dd');;

  const timestamp = new Date(time).getTime();
  const refTimestamp = referenceTime ? new Date(referenceTime).getTime() : Date.now();

  const diffTimestamp = refTimestamp - timestamp;
  const diffSenconds = Math.floor(diffTimestamp / 1000);
  const diffMinutes = Math.floor(diffSenconds / 60);
  const diffHours = Math.floor(diffSenconds / 3600);
  const diffDays = Math.floor(diffSenconds / 86400);

  if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
    return `${diffSenconds}秒前`;
  }

  if (diffDays === 0 && diffHours === 0) {
    return `${diffMinutes}分钟前`;
  }

  if (diffDays === 0) {
    return `${diffHours}小时前`;
  }

  return formatDate(time, 'yyyy-MM-dd');
};
