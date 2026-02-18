// app/layout.tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata = {
  title: "Yayvo",
  description: "Lifestyle discovery through emotional design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3500}
          closeOnClick
          pauseOnHover
          draggable
          toastStyle={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            borderRadius: 12,
            background: "#1A1612",
            color: "#FAFAF8",
            boxShadow: "0 8px 24px rgba(26,22,18,0.25)",
            border: "1px solid #2A2420",
          }}
        />
      </body>
    </html>
  );
}