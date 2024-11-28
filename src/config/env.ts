interface IConfig {
  databaseUrl: string;
  awsRegion: string,
  awsAccessKeyId: string,
  awsSecretAccessKey: string,
  s3BucketName: string,
  cloudWatchLogGroupName: string,
  cloudWatchLogStreamName: string,
  jwtSecret: string,
  jwtTokenName: string,
  nodeEnv: string,
}

const config: IConfig = {
  databaseUrl: process.env.DATABASE_URL as string,
  awsRegion: process.env.NEXT_PUBLIC_AWS_REGION as string,
  awsAccessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  s3BucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
  cloudWatchLogGroupName: process.env.NEXT_PUBLIC_CLOUD_WATCH_LOG_GROUP_NAME as string,
  cloudWatchLogStreamName: process.env.NEXT_PUBLIC_CLOUD_WATCH_LOG_STREAM_NAME as string,
  jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET as string,
  jwtTokenName: process.env.NEXT_PUBLIC_JWT_TOKEN_NAME as string,
  nodeEnv: process.env.NODE_ENV as string,
};

export default config;

