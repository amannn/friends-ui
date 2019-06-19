import {useLayoutEffect, useState} from 'react';

const getCurrentSize = node => ({
  offsetHeight: node ? node.offsetHeight : undefined,
  offsetWidth: node ? node.offsetWidth : undefined
});

export default function useNodeSize(nodeRef) {
  const [size, setSize] = useState(getCurrentSize(nodeRef.current));

  useLayoutEffect(
    () => {
      function onResize() {
        setSize(getCurrentSize(nodeRef.current));
      }

      onResize();

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
    [nodeRef]
  );

  return size;
}
