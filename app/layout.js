// app/layotu.js
import "@/app/_styles/globals.css";
import AuthLayout from "@/app/components/AuthLayout";

export const metadata = {
  title: {
    template: "%s | K App",
    default: "K App",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative dark:bg-gray-900">
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}
