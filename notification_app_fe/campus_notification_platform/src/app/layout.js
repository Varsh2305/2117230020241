import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

export const metadata = {
  title: "Campus Notifications",
  description: "Campus notification platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}