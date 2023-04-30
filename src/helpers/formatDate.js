const addZero = (num) => {
  if (num >= 0 && num <= 9) {
    return '0' + num;
  } else {
    return num;
  }
};

export const formatDate = (utc, delimiter = '.') => {
  const date = new Date(utc);
  return (
    addZero(date.getDate()) +
    delimiter +
    addZero(date.getMonth() + 1) +
    delimiter +
    addZero(date.getFullYear())
  );
};
