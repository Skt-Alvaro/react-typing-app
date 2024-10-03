import ConfigProvider from "./context/config";
import HistoryProvider from "./context/history";
import ThemeProvider from "./context/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ConfigProvider>
        <HistoryProvider>{children}</HistoryProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
