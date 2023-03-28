// hooks/useCookie.js
import { useState, useEffect } from 'react';

export const useCookie = (cookieName) => {
  const [cookieValue, setCookieValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const value = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
      return value ? value.pop() : '';
    }
    return '';
  });

  useEffect(() => {
    const updateCookieValue = () => {
      const value = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
      setCookieValue(value ? value.pop() : '');
    };

    window.addEventListener('storage', updateCookieValue);

    return () => {
      window.removeEventListener('storage', updateCookieValue);
    };
  }, [cookieName]);

  return cookieValue;
};
