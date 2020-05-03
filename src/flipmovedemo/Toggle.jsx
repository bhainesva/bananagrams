import React, { Component, PropTypes } from 'react';
import classNames from 'classnames'

export default ({clickHandler, text, icon, active, large}) => {
  const buttonClass = classNames({
    'button-toggle': true,
    'no-icon': !icon,
    active,
    large,
  });
  const iconClass = `fa fa-fw fa-${icon}`;

  return (
    <button className={buttonClass} onClick={clickHandler}>
      <i className={iconClass} />
      {text}
    </button>
  )
}
