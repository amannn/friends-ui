import {useEffect} from 'react';

export default function useScrollToBottom(node) {
  useEffect(
    () => {
      // When pressing refresh, browsers like Chrome will try
      // to restore the previous scroll position. Wait until
      // that has happened before scrolling to the bottom.
      const timeoutId = setTimeout(() => {
        node.scrollTop = node.scrollHeight;
      }, 50);

      return () => clearTimeout(timeoutId);
    },
    [node]
  );
}
