import React from 'react';

interface wrapperProps {
  variant?: 'small' | 'regular'
}

const Wrapper: React.FC<wrapperProps> = ({children, variant='regular'}) => {
  return (
    <div className={`mx-auto my-8 w-full ${variant === 'regular' ? `max-w-4xl` : `max-w-2xl`} `}>
      {children}
    </div>
  );
};

export default Wrapper
