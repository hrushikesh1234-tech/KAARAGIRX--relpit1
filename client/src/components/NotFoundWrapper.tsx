import { useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import Footer from './Footer';

interface NotFoundWrapperProps {
  children: ReactNode;
}

export default function NotFoundWrapper({ children }: NotFoundWrapperProps) {
  const location = useLocation();
  const [shouldHideFooter, setShouldHideFooter] = useState(false);
  
  useEffect(() => {
    // List of paths where we want to hide the footer
    const hideFooterPaths = ['shop', 'track', 'on-rent'];
    
    // Get the current pathname and remove leading/trailing slashes
    const path = location.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
    
    // Check if current path matches any of the hideFooterPaths
    const hide = hideFooterPaths.some(route => route === path);
    
    console.log('Current path:', path, 'Hide footer:', hide);
    setShouldHideFooter(hide);
  }, [location]);

  return (
    <>
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}
