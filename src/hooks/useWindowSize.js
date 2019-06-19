import {useEffect, useState} from 'react';

const getCurrentSize = () => ({
  innerHeight: window.innerHeight,
  innerWidth: window.innerWidth
});

export default function useWindowSize() {
  const [size, setSize] = useState(getCurrentSize());

  useEffect(() => {
    function onResize() {
      setSize(getCurrentSize());
    }

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}
