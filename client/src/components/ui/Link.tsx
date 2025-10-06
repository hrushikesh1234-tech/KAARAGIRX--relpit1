'use client';

import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { ComponentProps, forwardRef } from 'react';

type BaseLinkProps = Omit<ComponentProps<'a'>, 'ref' | 'to'>;
type LinkProps = ReactRouterLinkProps & BaseLinkProps;

function isExternalLink(href: string | unknown): boolean {
  if (typeof href !== 'string') return false;
  return /^https?:\/\//.test(href);
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ 
  to, 
  className = '', 
  ...props 
}, ref) => {
  const href = typeof to === 'string' ? to : to?.pathname || '';
  
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        className={`text-primary hover:underline ${className}`}
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  }

  // Internal link using React Router
  return (
    <ReactRouterLink
      to={to}
      className={`text-primary hover:underline ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Link.displayName = 'Link';

export { Link };
