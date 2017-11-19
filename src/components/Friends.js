import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';
import NumberUtils from '../utils/NumberUtils';
import Easing from '../utils/Easing';
import Person from './Person';
import cs from './Friends.module.css';

export default class Friends extends Component {
  static propTypes = {
    userPosition: PropTypes.object.isRequired,
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

      return {x, y: (i + 1) * (portraitSize + offsetY)};
    });
  }

  componentDidMount() {
    const {offsetHeight, portraitSize, userPosition} = this.props;
    const {parentNode} = this.rootNode;

    const scrollTop$ = Rx.Observable
      .interval(0, Rx.Scheduler.animationFrame)
      .map(() => parentNode.scrollTop);

    const userOrigin$ = scrollTop$.map(scrollTop => ({
      x: userPosition.left + portraitSize / 2,
      y: scrollTop + offsetHeight - userPosition.bottom - portraitSize / 2
    }));

    this.friendsBaseOrigins.forEach((friendBaseOrigin, i) => {
      const friendOrigin$ = userOrigin$.map(userOrigin =>
        this.applyRepulsion(friendBaseOrigin, userOrigin)
      );

      friendOrigin$
        .combineLatest(userOrigin$)
        .subscribe(args => this.onUpdateLine(this.lineNodes[i], ...args));

      friendOrigin$
        .combineLatest(userOrigin$)
        .subscribe(args => this.onUpdateFriend(this.friendNodes[i], ...args));
    });

    // Wait until the first render got flushed to the DOM
    setTimeout(() => {
      parentNode.scrollTop = parentNode.scrollHeight;
    }, 20);
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

    node.style.opacity = NumberUtils.interpolateRange({
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

  onUpdateLine = (node, friendOrigin, userOrigin) => {
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

    let degrees = NumberUtils.radiantToDegress(Math.atan(dy / dx));
    if (friendOrigin.y < userOrigin.y) degrees *= -1;
    if (friendOrigin.x < userOrigin.x) degrees = 180 - degrees;

    node.style.transform = `rotate(${degrees}deg) scaleX(${d})`;
    node.style.opacity = 1;
  };

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
    const {friends, portraitSize} = this.props;

    return (
      <div ref={this.onRootRef}>
        <div ref={this.onFriendsRef}>
          {friends.map(friend => (
            <Person
              className={cs.friend}
              key={friend.id}
              size={portraitSize}
              {...friend}
            />
          ))}
        </div>

        <div ref={this.onLinesRef}>
          {friends.map(friend => <div className={cs.line} key={friend.id} />)}
        </div>
      </div>
    );
  }
}
