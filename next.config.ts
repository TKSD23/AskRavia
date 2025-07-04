import type { NextConfig } from 'next';

const isAppHosting = !!process.env.FIREBASE_WEBAPP_CONFIG;

const firebaseConfig = isAppHosting
  ? JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG!)
  : {};

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Conditionally set the env vars ONLY if we are in App Hosting.
  // For local development, Next.js will automatically pick up NEXT_PUBLIC_
  // variables from your .env.local or .env file.
  ...(isAppHosting && {
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
      NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
    },
  }),
};

export default nextConfig;
