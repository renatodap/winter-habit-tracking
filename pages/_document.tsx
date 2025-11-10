// Next.js Document for custom HTML structure
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Winter Arc Habit Tracker - Personal PWA for tracking daily habits, weight, and fitness goals" />
        <meta name="application-name" content="Winter Arc" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
