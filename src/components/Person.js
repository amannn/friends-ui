import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cs from './Person.module.css';

const propTypes = {
  className: PropTypes.string,
  portrait: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.object
};

const Person = ({className, portrait, style, size}, ref) => (
  <div
    ref={ref}
    className={cx(cs.root, className)}
    style={{
      ...style,
      width: size,
      height: size,
      backgroundImage: `url(${portrait})`
    }}
  />
);

const Component = forwardRef(Person);
Component.propTypes = propTypes;
export default Component;
