import React from 'react';

function Button({ children, variant = 'primary', className = '', ...props }) {
  // Combine base btn class, variant class, and any custom classes
  const classes = `btn btn-${variant} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
