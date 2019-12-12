import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import MathUtils from '../utils/MathUtils';
import Person from './Person';

const propTypes = {
  className: PropTypes.string,
  friend: PropTypes.object.isRequired,
  friendOrigin$: PropTypes.object.isRequired,
  portraitSize: PropTypes.number.isRequired,
  userOrigin$: PropTypes.object.isRequired,
  userPosition: PropTypes.object.isRequired
};

function getTransform({friendOrigin, portraitSize}) {
  const x = friendOrigin.x - portraitSize / 2;
  const y = friendOrigin.y - portraitSize / 2;
  return `translate(${x}px, ${y}px)`;
}

function getOpacity({friendOrigin, portraitSize, userOrigin, userPosition}) {
  return MathUtils.interpolateRange({
    inputStart: userOrigin.y - portraitSize,
    inputEnd: userOrigin.y + userPosition.bottom + portraitSize,
    outputStart: 1,
    outputEnd: 0,
    current: friendOrigin.y
  });
}

const UserFriend = ({
  className,
  friend,
  friendOrigin$,
  portraitSize,
  userOrigin$,
  userPosition
}) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const subscriber = friendOrigin$
      .withLatestFrom(userOrigin$)
      .subscribe(([friendOrigin, userOrigin]) => {
        const node = nodeRef.current;

        node.style.transform = getTransform({
          friendOrigin,
          portraitSize
        });

        node.style.opacity = getOpacity({
          friendOrigin,
          portraitSize,
          userOrigin,
          userPosition
        });
      });

    return () => subscriber.unsubscribe();
  }, [friendOrigin$, portraitSize, userOrigin$, userPosition]);

  return (
    <Person
      ref={nodeRef}
      className={className}
      portrait={friend.portrait}
      size={portraitSize}
    />
  );
};

UserFriend.propTypes = propTypes;
export default UserFriend;
