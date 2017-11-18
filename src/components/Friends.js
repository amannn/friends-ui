import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as Animated from 'animated/lib/targets/react-dom';
import Easing from 'animated/lib/Easing';
import NumberUtils from '../utils/NumberUtils';
import Person from './Person';
import cs from './Friends.module.css';

export default class Friends extends Component {
  static propTypes = {
    userOrigin: PropTypes.object.isRequired,
    friends: PropTypes.array.isRequired,
    offsetY: PropTypes.number,
    offsetWidth: PropTypes.number,
    offsetHeight: PropTypes.number,
    portraitSize: PropTypes.number.isRequired,
    paddingSides: PropTypes.number
  };

  static defaultProps = {
    paddingSides: 20,
    offsetY: 40
  };

  state = {
    friendsOrigins: undefined,
    scrollTop: new Animated.Value(0),
    scrollHeight: undefined
  };

  componentWillMount() {
    const {
      friends,
      offsetY,
      offsetWidth,
      paddingSides,
      portraitSize
    } = this.props;

    const friendsOrigins = friends.map((friend, i) => {
      let left =
        paddingSides +
        portraitSize / 2 +
        Math.random() * (offsetWidth / 2 - paddingSides * 2 - portraitSize);
      if (i % 2 !== 0) left += offsetWidth / 2;

      return {left, top: (i + 1) * (portraitSize + offsetY)};
    });

    this.setState({friendsOrigins});

    this.state.scrollTop.addListener(this.onUpdateLines);
  }

  componentDidMount() {
    const {parentNode} = this.friendsNode;
    const {scrollHeight} = parentNode;
    this.setState({scrollHeight});
    parentNode.scrollTop = scrollHeight;

    const onFrame = () => {
      this.state.scrollTop.setValue(parentNode.scrollTop);
      requestAnimationFrame(onFrame);
    };
    requestAnimationFrame(onFrame);
  }

  onFriendsRef = node => {
    this.friendsNode = node;
  };

  onLinesRef = node => {
    this.lineNodes = node.children;
  };

  onUpdateLines = ({value: scrollTop}) => {
    const {userOrigin, portraitSize, offsetHeight} = this.props;
    const {friendsOrigins} = this.state;

    const positionedUserOrigin = {
      left: userOrigin.left,
      top: scrollTop + offsetHeight - userOrigin.bottom
    };

    const visibleFriendsOrigins = friendsOrigins.map(friendOrigin => {
      const top = friendOrigin.top - portraitSize / 2;
      const isOutOfViewport = top < scrollTop || top > scrollTop + offsetHeight;
      return isOutOfViewport ? undefined : friendOrigin;
    });

    visibleFriendsOrigins.forEach((friendOrigin, i) => {
      const node = this.lineNodes[i];

      if (!friendOrigin) {
        node.style.opacity = 0;
        return;
      }

      const dx = Math.abs(friendOrigin.left - positionedUserOrigin.left);
      const dy = Math.abs(friendOrigin.top - positionedUserOrigin.top);
      const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      let degrees = NumberUtils.radiantToDegress(Math.atan(dy / dx));
      if (friendOrigin.top < positionedUserOrigin.top) degrees *= -1;
      if (friendOrigin.left < positionedUserOrigin.left) {
        degrees = 180 - degrees;
      }

      node.style.transform = `rotate(${degrees}deg) scaleX(${d})`;
      node.style.opacity = 1;
    });
  };

  interpolateFriendOpacity(friendOrigin) {
    const {userOrigin, offsetHeight, portraitSize} = this.props;
    const {scrollTop, scrollHeight} = this.state;
    if (!scrollHeight) return 0;

    return scrollTop.interpolate({
      inputRange: [
        friendOrigin.top - offsetHeight,
        friendOrigin.top - offsetHeight + userOrigin.bottom + portraitSize / 2
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
  }

  interpolateFriendTransform(friendOrigin) {
    const {userOrigin, offsetHeight, portraitSize} = this.props;
    const {scrollTop, scrollHeight} = this.state;
    if (!scrollHeight) return 0;

    const minOriginD = portraitSize + 20;
    const baseOriginsD = Math.abs(userOrigin.left - friendOrigin.left);
    const isRight = friendOrigin.left > userOrigin.left;
    const maxTranslation = minOriginD - baseOriginsD;
    const userOriginTop = friendOrigin.top - offsetHeight + userOrigin.bottom;

    // The friend is too far away from the user, so no translation is necessary.
    if (maxTranslation <= 0) return [];

    return [
      {
        translateX: scrollTop.interpolate({
          inputRange: [
            userOriginTop - minOriginD,
            userOriginTop,
            userOriginTop + minOriginD
          ],
          outputRange: [0, isRight ? maxTranslation : -maxTranslation, 0],
          easing: Easing.inOut(Easing.quad),
          extrapolate: 'clamp'
        })
      }
    ];
  }

  render() {
    const {friends, portraitSize} = this.props;
    const {friendsOrigins} = this.state;

    return (
      <div ref={this.onFriendsRef}>
        <div>
          {friends.map((friend, i) => (
            <Animated.div
              className={cs.friend}
              key={friend.id}
              style={{
                opacity: this.interpolateFriendOpacity(friendsOrigins[i]),
                transform: this.interpolateFriendTransform(friendsOrigins[i]),
                left: friendsOrigins[i].left - portraitSize / 2,
                top: friendsOrigins[i].top - portraitSize / 2
              }}
            >
              <Person size={portraitSize} {...friend} />
            </Animated.div>
          ))}
        </div>

        <div ref={this.onLinesRef}>
          {friends.map(friend => <div className={cs.line} key={friend.id} />)}
        </div>
      </div>
    );
  }
}
