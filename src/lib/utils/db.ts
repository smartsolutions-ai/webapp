import neo4j from 'neo4j-driver';

export async function connectToDatabase() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!),
    {
      maxConnectionLifetime: 10 * 60 * 1000, // 10 minutes
      maxConnectionPoolSize: 300,
      logging: {
        level: 'error',
        logger: (level, message) => console.log('+++' + level + ' ' + message),
      },
    }
  );

  return driver;
} 