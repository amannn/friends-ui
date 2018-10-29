import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cs from './Person.module.css';

const propTypes = {
  className: PropTypes.string,
  portrait: PropTypes.string.isRequired,
  style: PropTypes.object,
  size: PropTypes.number
};

const Person = forwardRef(({className, portrait, style, size}, ref) => (
  <div
    className={cx(cs.root, className)}
    ref={ref}
    style={{
      ...style,
      width: size,
      height: size,
      backgroundImage: `url(${portrait})`
    }}
  />
));

Person.propTypes = propTypes;
export default Person;
