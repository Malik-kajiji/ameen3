import { ThemeProvider } from "next-themes";

export default function CustomThemeProvider({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
