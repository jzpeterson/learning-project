import {GenericContainer, PullPolicy, StartedTestContainer} from 'testcontainers';

let postgresContainer: StartedTestContainer;

async function startPostgresContainer() {
    console.log('Starting Postgres container');
    postgresContainer = await new GenericContainer('postgres')
        .withPullPolicy(PullPolicy.alwaysPull())
        .withEnvironment({POSTGRES_USER: 'user', POSTGRES_PASSWORD: 'password', POSTGRES_DB: 'testdb'})
        .withStartupTimeout(120000)
        .withExposedPorts(5432)
        .start();
    console.log(`Postgres container started at ${postgresContainer.getHost()}:
    ${postgresContainer.getMappedPort(5432)}`);

    process.env.TEST_DATABASE_URL = `postgresql://testuser:testpass@${postgresContainer.getHost()}:
    ${postgresContainer.getMappedPort(5432)}/testdb`;
}

async function stopPostgresContainer() {
    console.log('Stopping Postgres container');
    if (postgresContainer) {
        await postgresContainer.stop();
    }
}

export {startPostgresContainer, stopPostgresContainer};
