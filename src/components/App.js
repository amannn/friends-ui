import React, {Fragment, useRef} from 'react';
import PropTypes from 'prop-types';
import useWindowSize from '../hooks/useWindowSize';
import useNodeSize from '../hooks/useNodeSize';
import Friends from './Friends';
import Person from './Person';
import cs from './App.module.css';

const propTypes = {
  friends: PropTypes.array.isRequired,
  portraitSize: PropTypes.number,
  user: PropTypes.object.isRequired,
  userBottomMargin: PropTypes.number
};

const defaultProps = {
  portraitSize: 80,
  userBottomMargin: 40
};

function App({friends, portraitSize, user, userBottomMargin}) {
  const rootRef = useRef(null);
  const windowSize = useWindowSize();
  const rootSize = useNodeSize(rootRef);
  const hasLayout = rootRef.current != null;

  let userPosition;
  if (hasLayout) {
    userPosition = {
      left: rootSize.offsetWidth / 2 - portraitSize / 2,
      bottom: userBottomMargin
    };
  }

  return (
    <div
      className={cs.root}
      ref={rootRef}
      style={{height: windowSize.innerHeight}}
    >
      {hasLayout && (
        <Fragment>
          <Friends
            friends={friends}
            offsetHeight={windowSize.innerHeight}
            offsetWidth={rootSize.offsetWidth}
            portraitSize={portraitSize}
            scrollerNode={rootRef.current}
            userPosition={userPosition}
          />
          <Person
            className={cs.user}
            portrait={user.portrait}
            size={portraitSize}
            style={{
              bottom: userPosition.bottom,
              left: (windowSize.innerWidth - portraitSize) / 2
            }}
          />
        </Fragment>
      )}
    </div>
  );
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;
export default App;
