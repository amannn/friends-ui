import {useLayoutEffect, useState} from 'react';

const getCurrentSize = node => ({
  offsetHeight: node ? node.offsetHeight : undefined,
  offsetWidth: node ? node.offsetWidth : undefined
});

export default function useNodeSize(nodeRef) {
  const [size, setSize] = useState(getCurrentSize(nodeRef.current));

  function onResize() {
    setSize(getCurrentSize(nodeRef.current));
  }

  useLayoutEffect(
    () => {
      onResize();

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
    [nodeRef]
  );

  return size;
}
