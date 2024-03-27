import React from 'react';

const Legend = ({ parameterPalette }) => {
  return (
    <div>
      <h2>Legend</h2>
      <ul>
        {parameterPalette.map((item, index) => (
          <li key={index} style={{ color: item.color }}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
