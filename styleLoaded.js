export const styleLoaded = (map, handler) => {
  if (map.isStyleLoaded()) {
    handler();
    return;
  }

  const callback = () => {
    if (map.isStyleLoaded()) {
      handler();
      map.off('data', callback);
    }
  };

  map.on('data', callback);
};