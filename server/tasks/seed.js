import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import { users } from '../config/mongoCollections.js';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    console.log('Done seeding database');
    await closeConnection();
}

main().catch(console.log);