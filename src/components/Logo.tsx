import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  tone?: 'dark' | 'light';
  variant?: 'full' | 'isotype';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  tone = 'dark',
  variant = 'full',
}) => {
  const [failed, setFailed] = useState(false);

  const imgSrc =
    variant === 'isotype'
      ? '/brand/isotipo-sitecorp.png'
      : '/brand/logo-sitecorp-full.png';

  if (failed) {
    return (
      <span
        aria-label="Sitecorp"
        className={`inline-flex items-baseline font-sans text-xl font-extrabold leading-none tracking-tight ${
          tone === 'light' ? 'text-white' : 'text-[#123F55]'
        } ${className}`}
      >
        Site<span className="text-[#F49D37]">corp</span>
      </span>
    );
  }

  return (
    <img
      src={imgSrc}
      alt="Sitecorp"
      onError={() => setFailed(true)}
      draggable={false}
      className={`select-none object-contain ${
        variant === 'isotype'
          ? 'w-8 h-8'
          : tone === 'light'
          ? 'h-8 sm:h-9 w-auto brightness-0 invert'
          : 'h-8 sm:h-9 w-auto'
      } ${className}`}
    />
  );
};
