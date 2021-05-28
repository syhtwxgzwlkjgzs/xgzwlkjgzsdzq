export const typeFilter = (data, type) => {
  let targetData = {};
  Object.keys(data).forEach((key) => {
    if (type === key) {
      targetData = data[key];
    }
  });

  return targetData;
};
