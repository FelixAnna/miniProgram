const source = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const sourceLen = source.length;

export const getShortcode = number => {
  if (isNaN(number)) {
    return number;
  }

  let result = "";
  let re = number;
  do {
    const index = re % sourceLen;
    result = source[index] + result;

    re = parseInt(re / sourceLen);
  } while (re >= 1);

  return result;
};

export const getRandomShortcode = () => {
  let number = new Date().getTime();
  return getShortcode(number);
};
