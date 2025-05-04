import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Blockchain Evidence Tracker',
  description: 'Secure, tamper-proof evidence management powered by AI and blockchain technology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
