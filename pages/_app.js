// pages/_app.js
import { Inter } from '@next/font/google';
import '../styles/globals.css';

// Load Inter with a specific weight (500 for Medium)
const inter = Inter({
  subsets: ['latin'],
  weight: '500',  // Set the weight to Inter Medium
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
