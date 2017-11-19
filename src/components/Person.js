import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cs from './Person.module.css';

const propTypes = {
  className: PropTypes.string,
  portrait: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onNodeRef: PropTypes.func,
  style: PropTypes.object,
  size: PropTypes.number
};

const Person = ({className, portrait, onClick, onNodeRef, style, size}) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cx(cs.root, className)}
      onClick={onClick}
      ref={onNodeRef}
      style={{
        ...style,
        width: size,
        height: size,
        backgroundImage: `url(${portrait})`
      }}
    />
  );
};

Person.propTypes = propTypes;
export default Person;
