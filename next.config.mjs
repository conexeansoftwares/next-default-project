/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suporte a módulos standalone para Docker
  output: 'standalone',

  // Configuração de imagens
  images: {
    domains: ['staging-supervisao-portaria-24-hs.s3.us-east-1.amazonaws.com'],
  },

  // Mapeamento de variáveis de ambiente
  env: {
    // Banco de dados
    DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL,

    // Configurações AWS
    AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,

    // Configurações S3
    S3_BUCKET_NAME: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,

    // Configurações CloudWatch
    CLOUD_WATCH_LOG_GROUP_NAME:
      process.env.NEXT_PUBLIC_CLOUD_WATCH_LOG_GROUP_NAME,
    CLOUD_WATCH_LOG_STREAM_NAME:
      process.env.NEXT_PUBLIC_CLOUD_WATCH_LOG_STREAM_NAME,

    // Configurações JWT
    JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
    JWT_TOKEN_NAME: process.env.NEXT_PUBLIC_JWT_TOKEN_NAME,

  },

  // Configurações de segurança e otimização
  reactStrictMode: true,

  // Cabeçalhos de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
