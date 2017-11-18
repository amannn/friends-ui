import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cs from './Person.module.css';

const propTypes = {
  className: PropTypes.string,
  portrait: PropTypes.string.isRequired,
  style: PropTypes.object,
  size: PropTypes.number
};

const Person = ({className, portrait, style, size}) => (
  <div
    className={cx(cs.root, className)}
    style={{
      ...style,
      width: size,
      height: size,
      backgroundImage: `url(${portrait})`
    }}
  />
);

Person.propTypes = propTypes;
export default Person;
