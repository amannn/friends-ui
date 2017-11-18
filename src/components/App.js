import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Friends from './Friends';
import Person from './Person';
import cs from './App.module.css';

export default class App extends Component {
  static propTypes = {
    me: PropTypes.object.isRequired,
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
    meOrigin: undefined,
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
      meOrigin: {
        left: offsetWidth / 2,
        bottom: 40 + portraitSize / 2
      },
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      offsetWidth
    });
  }

  render() {
    const {friends, me, portraitSize} = this.props;
    const {meOrigin, innerHeight, innerWidth, offsetWidth} = this.state;
    const hasMeasured = meOrigin !== undefined;

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
            meOrigin={meOrigin}
            offsetHeight={innerHeight}
            offsetWidth={offsetWidth}
            portraitSize={portraitSize}
          />,

          <Person
            {...me}
            className={cs.me}
            key="me"
            size={portraitSize}
            style={{
              bottom: meOrigin.bottom - portraitSize / 2,
              left: (innerWidth - portraitSize) / 2
            }}
          />
        ]}
      </div>
    );
  }
}
