interface IConfig {
  databaseUrl: string;
}

const config: IConfig = {
  databaseUrl: process.env.DATABASE_URL || '',
};

export default config;
