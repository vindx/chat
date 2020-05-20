import { useState, useEffect } from 'react';
import storage from 'local-storage-fallback';

const useTheme = (defaultTheme = { mode: 'light' }) => {
  const getInitialTheme = () => {
    const savedTheme = storage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  };

  const [theme, _setTheme] = useState(getInitialTheme);

  useEffect(() => {
    storage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  return {
    ...theme,
    setTheme: ({ setTheme, ...them }) => _setTheme(them),
  };
};

export default useTheme;
