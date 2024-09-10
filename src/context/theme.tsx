import React from "react";

interface ThemeContextProps {
  theme: string;
  toggleTheme: (newTheme: string) => void;
}

interface Props {
  children: React.ReactNode;
}

const ThemeContext = React.createContext({} as ThemeContextProps);

export const useTheme = () => React.useContext(ThemeContext);

const ThemeProvider = (props: Props) => {
  const [theme, setTheme] = React.useState<string>("light");

  const toggleTheme = React.useCallback((newTheme: string) => {
    setTheme(newTheme);
  }, []);

  const themeProviderValue = React.useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={themeProviderValue}>
      <div className={theme}>{props.children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
