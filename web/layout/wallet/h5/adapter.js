export const typeFilter = (data, type) => {
  Object.keys(data).forEach((key) => {
    if (type === key) {
      return data[key];
    }
  });
};
