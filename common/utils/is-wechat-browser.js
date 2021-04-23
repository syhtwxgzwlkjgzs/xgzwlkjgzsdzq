const isWeiXin = () => {
  const uExplorer = window.navigator.userAgent.toLowerCase();
  return uExplorer.match(/MicroMessenger/i) === 'micromessenger';
};

export default isWeiXin;
