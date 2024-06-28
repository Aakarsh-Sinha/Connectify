// Changed object
import React from 'react';

const MyComponent = ({ name, age }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
      <p>This is a JSX component example.</p>
    </div>
  );
};

export default MyComponent;