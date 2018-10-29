import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import MathUtils from '../utils/MathUtils';
import cs from './Line.module.css';

const propTypes = {
  hideOffsetBottom: PropTypes.number.isRequired,
  hideOffsetTop: PropTypes.number.isRequired,
  sourceOrigin$: PropTypes.object.isRequired,
  style: PropTypes.object,
  targetOrigin$: PropTypes.object.isRequired
};

function getTransform({sourceOrigin, targetOrigin}) {
  const dx = Math.abs(targetOrigin.x - sourceOrigin.x);
  const dy = Math.abs(targetOrigin.y - sourceOrigin.y);
  const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  let degrees = MathUtils.radiantToDegress(Math.atan(dy / dx));
  if (targetOrigin.y < sourceOrigin.y) degrees *= -1;
  if (targetOrigin.x < sourceOrigin.x) degrees = 180 - degrees;

  return `rotate(${degrees}deg) scaleX(${d})`;
}

const Line = ({
  hideOffsetBottom,
  hideOffsetTop,
  sourceOrigin$,
  style,
  targetOrigin$
}) => {
  const nodeRef = useRef(null);

  useEffect(
    () => {
      const subscriber = targetOrigin$
        .withLatestFrom(sourceOrigin$)
        .subscribe(([targetOrigin, sourceOrigin]) => {
          const node = nodeRef.current;

          const isOutOfViewport =
            sourceOrigin.y - targetOrigin.y > hideOffsetBottom ||
            targetOrigin.y - sourceOrigin.y > hideOffsetTop;

          node.style.opacity = isOutOfViewport ? 0 : 1;
          if (!isOutOfViewport) {
            node.style.transform = getTransform({sourceOrigin, targetOrigin});
          }
        });

      return () => subscriber.unsubscribe();
    },
    [
      hideOffsetBottom,
      hideOffsetTop,
      targetOrigin$,
      sourceOrigin$,
      nodeRef.current
    ]
  );

  return <div className={cs.root} ref={nodeRef} style={style} />;
};

Line.propTypes = propTypes;
export default Line;
