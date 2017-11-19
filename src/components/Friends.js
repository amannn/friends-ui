import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';
import cx from 'classnames';
import MathUtils from '../utils/MathUtils';
import {createSpringObservable, Spring} from '../utils/SpringObservable';
import Easing from '../utils/Easing';
import Person from './Person';
import cs from './Friends.module.css';

export default class Friends extends Component {
  static propTypes = {
    friends: PropTypes.array.isRequired,
    offsetHeight: PropTypes.number,
    offsetWidth: PropTypes.number,
    offsetY: PropTypes.number,
    onSelectFriend: PropTypes.func.isRequired,
    paddingSides: PropTypes.number,
    portraitSize: PropTypes.number.isRequired,
    selectedFriendIndex: PropTypes.number,
    userPosition: PropTypes.object.isRequired
  };

  static defaultProps = {
    paddingSides: 20,
    offsetY: 40
  };

  componentWillMount() {
    const {
      friends,
      offsetY,
      offsetWidth,
      paddingSides,
      portraitSize
    } = this.props;

    this.friendsBaseOrigins = friends.map((friend, i) => {
      let x =
        paddingSides +
        portraitSize / 2 +
        Math.random() * (offsetWidth / 2 - paddingSides * 2 - portraitSize);
      if (i % 2 !== 0) x += offsetWidth / 2;
      const y = (i + 1) * (portraitSize + offsetY);

      return {x, y};
    });
  }

  componentDidMount() {
    const {offsetHeight, portraitSize, userPosition} = this.props;
    const {parentNode} = this.rootNode;
    this.friendsOrigins = [];

    // Reading `scrollTop` every animation frame is more accurate than listening
    // for scroll events, as those are only dispatched on a "best effort" basis.
    const userOrigin$ = Rx.Observable
      .interval(0, Rx.Scheduler.animationFrame)
      .map(() => parentNode.scrollTop)
      .map(scrollTop => ({
        x: userPosition.left + portraitSize / 2,
        y: scrollTop + offsetHeight - userPosition.bottom - portraitSize / 2
      }));

    this.hideSpring = new Spring();
    const hideSpring$ = createSpringObservable(this.hideSpring);

    this.friendsBaseOrigins.forEach((friendBaseOrigin, i) => {
      Rx.Observable
        .of(friendBaseOrigin)
        .combineLatest(hideSpring$)
        .map(([friendOrigin, hideSpringValue]) =>
          this.applySpringToFriendOrigin(friendOrigin, hideSpringValue)
        )
        .combineLatest(userOrigin$)
        .map(([friendOrigin, userOrigin]) =>
          this.applyRepulsion(friendOrigin, userOrigin)
        )
        .withLatestFrom(userOrigin$, hideSpring$)
        .subscribe(([friendOrigin, userOrigin, hideSpringValue]) => {
          this.onUpdateFriend(this.friendNodes[i], friendOrigin, userOrigin);
          this.onUpdateLine(
            this.lineNodes[i],
            friendOrigin,
            userOrigin,
            hideSpringValue
          );
          this.friendsOrigins[i] = friendOrigin;
        });
    });

    // Wait until the first render got flushed to the DOM
    setTimeout(() => {
      parentNode.scrollTop = parentNode.scrollHeight;
    }, 20);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.selectedFriendIndex && this.props.selectedFriendIndex) {
      this.hideSpring.updateConfig({fromValue: 0, toValue: 1});
      this.hideSpring.start();
    }
  }

  onRootRef = node => {
    this.rootNode = node;
  };

  onFriendsRef = node => {
    this.friendNodes = node.children;
  };

  onLinesRef = node => {
    this.lineNodes = node.children;
  };

  onUpdateFriend = (node, friendOrigin, userOrigin) => {
    const {portraitSize} = this.props;
    const {userPosition} = this.props;

    node.style.opacity = MathUtils.interpolateRange({
      inputStart: userOrigin.y - portraitSize,
      inputEnd: userOrigin.y + userPosition.bottom + portraitSize,
      outputStart: 1,
      outputEnd: 0,
      current: friendOrigin.y
    });

    const x = friendOrigin.x - portraitSize / 2;
    const y = friendOrigin.y - portraitSize / 2;
    node.style.transform = `translate(${x}px, ${y}px)`;
  };

  onUpdateLine = (node, friendOrigin, userOrigin, hideSpringValue) => {
    const {offsetHeight, userPosition, portraitSize} = this.props;

    const isOutOfViewport =
      userOrigin.y - friendOrigin.y > offsetHeight - portraitSize / 2 ||
      friendOrigin.y - userOrigin.y > userPosition.bottom + portraitSize;

    if (isOutOfViewport) {
      node.style.opacity = 0;
      return;
    }

    const dx = Math.abs(friendOrigin.x - userOrigin.x);
    const dy = Math.abs(friendOrigin.y - userOrigin.y);
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    let degrees = MathUtils.radiantToDegress(Math.atan(dy / dx));
    if (friendOrigin.y < userOrigin.y) degrees *= -1;
    if (friendOrigin.x < userOrigin.x) degrees = 180 - degrees;

    node.style.transform = `rotate(${degrees}deg) scaleX(${d})`;
    node.style.opacity = 1 - hideSpringValue;
  };

  onPersonClick = i => this.props.onSelectFriend(i, this.friendsOrigins[i]);

  applySpringToFriendOrigin(friendOrigin, hideSpringValue) {
    const {offsetWidth, portraitSize} = this.props;
    const extraOffset = portraitSize / 2;
    const isLeft = friendOrigin.x < offsetWidth / 2;
    const springFactor = isLeft
      ? -friendOrigin.x - portraitSize / 2 - extraOffset
      : offsetWidth - friendOrigin.x + portraitSize / 2 + extraOffset;

    return {
      ...friendOrigin,
      x: friendOrigin.x + hideSpringValue * springFactor
    };
  }

  applyRepulsion = (friendBaseOrigin, userOrigin) => {
    const {portraitSize} = this.props;
    const minD = portraitSize + 30;

    const dx = Math.abs(friendBaseOrigin.x - userOrigin.x);
    const dy = Math.abs(friendBaseOrigin.y - userOrigin.y);
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    let repulsion = 0;

    if (d < minD) {
      const newX = Math.sqrt(Math.pow(minD, 2) - Math.pow(dy, 2));
      repulsion = newX - dx;
      repulsion = Easing.easeInQuad(repulsion / portraitSize) * portraitSize;
      if (friendBaseOrigin.x < userOrigin.x) repulsion *= -1;
    }

    return {
      y: friendBaseOrigin.y,
      x: friendBaseOrigin.x + repulsion
    };
  };

  render() {
    const {friends, selectedFriendIndex, portraitSize} = this.props;

    return (
      <div ref={this.onRootRef}>
        <div ref={this.onFriendsRef}>
          {friends.map((friend, i) => (
            <Person
              className={cx(cs.friend, {
                [cs.friend_hidden]: i === selectedFriendIndex
              })}
              key={friend.id}
              onClick={() => this.onPersonClick(i)}
              size={portraitSize}
              {...friend}
            />
          ))}
        </div>

        <div ref={this.onLinesRef}>
          {friends.map((friend, i) => (
            <div
              className={cx(cs.line, {
                [cs.line_hidden]: i === selectedFriendIndex
              })}
              key={friend.id}
            />
          ))}
        </div>
      </div>
    );
  }
}
