import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';
import MathUtils from '../utils/MathUtils';
import useScrollToBottom from '../hooks/useScrollToBottom';
import Line from './Line';
import UserFriend from './UserFriend';
import cs from './Friends.module.css';

const propTypes = {
  friends: PropTypes.array.isRequired,
  offsetHeight: PropTypes.number,
  offsetWidth: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  offsetY: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  paddingSides: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  portraitSize: PropTypes.number.isRequired,
  scrollerNode: PropTypes.object.isRequired,
  userPosition: PropTypes.object.isRequired
};

const defaultProps = {
  paddingSides: 20,
  offsetY: 40
};

function createStreams({
  friends,
  paddingSides,
  portraitSize,
  offsetWidth,
  offsetY,
  scrollerNode,
  userPosition,
  offsetHeight
}) {
  // Friends are distributed alternately on the
  // left and right side with some randomization.
  const initialFriendOrigins = friends.map((friend, i) => {
    let x =
      paddingSides +
      portraitSize / 2 +
      Math.random() * (offsetWidth / 2 - paddingSides * 2 - portraitSize);
    if (i % 2 !== 0) x += offsetWidth / 2;
    const y = (i + 1) * (portraitSize + offsetY);

    return {x, y};
  });

  // Reading `scrollTop` every animation frame is more accurate than listening
  // for scroll events, as those are only dispatched on a "best effort" basis.
  const userOrigin$ = Rx.Observable
    .interval(0, Rx.Scheduler.animationFrame)
    .map(() => ({
      x: userPosition.left + portraitSize / 2,
      y:
        scrollerNode.scrollTop +
        offsetHeight -
        userPosition.bottom -
        portraitSize / 2
    }));

  const friendOrigins$ = userOrigin$.map(userOrigin =>
    initialFriendOrigins.map(friendBaseOrigin =>
      MathUtils.applyRepulsion(userOrigin, friendBaseOrigin, portraitSize)
    )
  );

  return {userOrigin$, friendOrigins$};
}

function Friends(props) {
  const {
    friends,
    portraitSize,
    offsetHeight,
    scrollerNode,
    userPosition
  } = props;
  const [streams, setStreams] = useState(undefined);

  useEffect(() => setStreams(createStreams(props)), [...Object.values(props)]);
  useScrollToBottom(scrollerNode, [streams]);

  if (!streams) return null;
  const {userOrigin$, friendOrigins$} = streams;

  return (
    <div>
      {friends.map((friend, i) => {
        const friendOrigin$ = friendOrigins$.map(
          friendOrigins => friendOrigins[i]
        );

        return (
          <Fragment key={friend.id}>
            <UserFriend
              className={cs.friend}
              friend={friend}
              friendOrigin$={friendOrigin$}
              portraitSize={portraitSize}
              userOrigin$={userOrigin$}
              userPosition={userPosition}
            />
            <Line
              hideOffsetBottom={offsetHeight - portraitSize / 2}
              hideOffsetTop={userPosition.bottom + portraitSize}
              sourceOrigin$={userOrigin$}
              style={{
                left: '50%',
                bottom: userPosition.bottom + portraitSize / 2
              }}
              targetOrigin$={friendOrigin$}
            />
          </Fragment>
        );
      })}
    </div>
  );
}

Friends.propTypes = propTypes;
Friends.defaultProps = defaultProps;
export default Friends;
