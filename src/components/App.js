import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Friends from './Friends';
import Person from './Person';
import cs from './App.module.css';

export default class App extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    friends: PropTypes.array.isRequired,
    portraitSize: PropTypes.number
  };

  static defaultProps = {
    portraitSize: 75
  };

  state = {
    innerHeight: undefined,
    innerWidth: undefined,
    offsetWidth: undefined,
    userPosition: undefined,
    scrollHeight: undefined
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
    const {friends, user, portraitSize} = this.props;
    const {userPosition, innerHeight, innerWidth, offsetWidth} = this.state;
    const hasMeasured = userPosition !== undefined;

    return (
      <div
        className={cs.root}
        ref={this.onRootRef}
        style={{height: innerHeight}}
      >
        {hasMeasured && [
          <Friends
            friends={friends}
            key="friends"
            offsetHeight={innerHeight}
            offsetWidth={offsetWidth}
            portraitSize={portraitSize}
            userPosition={userPosition}
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
