import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';

const client = new CloudWatchLogsClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogParams {
  level: LogLevel;
  message: string;
  error?: Error;
  additionalInfo?: object;
}

export async function logToCloudWatch({
  level,
  message,
  error,
  additionalInfo,
}: LogParams): Promise<void> {
  const timestamp = new Date().getTime();

  let logMessage = `[${level}] ${message}`;

  if (error) {
    logMessage += `\nError: ${error.message}\nStack: ${error.stack}`;
  }

  if (additionalInfo) {
    logMessage += `\nAdditional Info: ${JSON.stringify(additionalInfo)}`;
  }

  const params = {
    logGroupName: process.env.NEXT_PUBLIC_CLOUD_WATCH_LOG_GROUP_NAME,
    logStreamName: process.env.NEXT_PUBLIC_CLOUD_WATCH_LOG_STREAM_NAME,
    logEvents: [
      {
        message: logMessage,
        timestamp,
      },
    ],
  };

  try {
    const command = new PutLogEventsCommand(params);
    await client.send(command);
  } catch (err) {
    console.error('Falha ao enviar erros para o CloudWatch:', err);
  }
}

export const logInfo = (message: string, additionalInfo?: object) =>
  logToCloudWatch({ level: 'INFO', message, additionalInfo });

export const logWarn = (message: string, additionalInfo?: object) =>
  logToCloudWatch({ level: 'WARN', message, additionalInfo });

export const logError = (
  message: string,
  error: Error,
  additionalInfo?: object,
) => logToCloudWatch({ level: 'ERROR', message, error, additionalInfo });

export const logDebug = (message: string, additionalInfo?: object) =>
  logToCloudWatch({ level: 'DEBUG', message, additionalInfo });
