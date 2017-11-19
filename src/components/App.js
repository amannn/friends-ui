import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Friends from './Friends';
import Mutuals from './Mutuals';
import Person from './Person';
import cs from './App.module.css';

export default class App extends Component {
  static propTypes = {
    mutuals: PropTypes.array.isRequired,
    friends: PropTypes.array.isRequired,
    portraitSize: PropTypes.number,
    user: PropTypes.object.isRequired
  };

  static defaultProps = {
    portraitSize: 75
  };

  state = {
    innerHeight: undefined,
    innerWidth: undefined,
    offsetWidth: undefined,
    selectedFriend: undefined,
    userPosition: undefined
  };

  componentDidMount() {
    this.measure();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => this.measure();

  onRootRef = node => {
    this.rootNode = node;
  };

  onSelectFriend = (index, origin) =>
    this.setState({selectedFriend: {index, origin}});

  measure() {
    const {portraitSize} = this.props;
    const {offsetWidth} = this.rootNode;

    this.setState({
      userPosition: {
        left: offsetWidth / 2 - portraitSize / 2,
        bottom: 40
      },
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      offsetWidth
    });
  }

  render() {
    const {friends, mutuals, user, portraitSize} = this.props;
    const {
      innerHeight,
      innerWidth,
      offsetWidth,
      selectedFriend,
      userPosition
    } = this.state;
    const hasMeasured = userPosition !== undefined;
    const selectedFriendIndex = selectedFriend
      ? selectedFriend.index
      : undefined;
    const enhancedSelectedFriend = selectedFriend
      ? {...friends[selectedFriend.index], ...selectedFriend}
      : undefined;

    return (
      <div
        className={cx(cs.root, {[cs.root_preventScrolling]: selectedFriend})}
        ref={this.onRootRef}
        style={{height: innerHeight}}
      >
        {hasMeasured && [
          <Friends
            friends={friends}
            key="friends"
            offsetHeight={innerHeight}
            offsetWidth={offsetWidth}
            onSelectFriend={this.onSelectFriend}
            portraitSize={portraitSize}
            selectedFriendIndex={selectedFriendIndex}
            userPosition={userPosition}
          />,

          <Mutuals
            friend={enhancedSelectedFriend}
            key="mutuals"
            mutuals={mutuals}
            offsetHeight={innerHeight}
            offsetWidth={offsetWidth}
            portraitSize={portraitSize}
          />,

          <Person
            {...user}
            className={cs.user}
            key="user"
            size={portraitSize}
            style={{
              bottom: userPosition.bottom,
              left: (innerWidth - portraitSize) / 2
            }}
          />
        ]}
      </div>
    );
  }
}
