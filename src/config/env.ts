interface IConfig {
  databaseUrl: string;
  awsRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  s3BucketName: string;
  cloudWatchLogGroupName: string;
  cloudWatchLogStreamName: string;
  jwtSecret: string;
  jwtTokenName: string;
  redisHost: string;
  redisPort: number;
  redisPassword: string;
  nodeEnv: string;
}

function loadConfig(): IConfig {
  return {
    databaseUrl: process.env.DATABASE_URL || '',
    awsRegion: process.env.AWS_REGION || '',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3BucketName: process.env.S3_BUCKET_NAME || '',
    cloudWatchLogGroupName: process.env.CLOUD_WATCH_LOG_GROUP_NAME || '',
    cloudWatchLogStreamName: process.env.CLOUD_WATCH_LOG_STREAM_NAME || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtTokenName: process.env.JWT_TOKEN_NAME || '',
    redisHost: process.env.REDIS_HOST || '',
    redisPort: parseInt(process.env.REDIS_PORT || '6379'),
    redisPassword: process.env.REDIS_PASSWOR || '',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

const config = loadConfig();
export default config;