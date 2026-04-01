import React from 'react';

function Input({ label, id, ...props }) {
  return (
    <div className="input-container">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input 
        id={id}
        className="input-field"
        {...props} 
      />
    </div>
  );
}

export default Input;
