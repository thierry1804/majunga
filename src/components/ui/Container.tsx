import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  id,
  as: Component = 'div',
}) => {
  return (
    <Component
      id={id}
      className={`max-w-content mx-auto px-5 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Component>
  );
};

export default Container;
