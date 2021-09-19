const isContentSame = function (storeUrl, url, error) {
  if (url.length !== storeUrl.length || error.length) return false;
  // check if length of the filtered array matches store array
  const filtered = storeUrl.filter(item => {
    return url.includes(item);
  });
  if (filtered.length === storeUrl.length) return true;

  return false;
};
export default isContentSame;
