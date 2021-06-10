const PROJECT_ID = '';
const INSTANCE_ID = 'lp-spanner';
const DATABASE_ID = 'lp-database';

// Imports the Google Cloud client library
const {Spanner} = require('@google-cloud/spanner');

(async () => {
  // Creates a client
  const spanner = new Spanner({ 
    projectId: PROJECT_ID, 
    keyFilename: './keyfile.json'
  });
  
  // Gets a reference to a Cloud Spanner instance and database
  const instance = spanner.instance(INSTANCE_ID);
  const database = instance.database(DATABASE_ID);

  // The query to execute
  const query = {
    sql: 'SELECT * FROM Winners;',
  };

  // Execute a simple SQL statement
  const [rows] = await database.run(query);
  console.log(`Query: ${rows.length} found.`);
  rows.forEach(row => console.log(row.toJSON()));

  // ##################
  // #                #
  // # Part 2: Insert #
  // #                #
  // ##################

  if (process.argv.find(arg => arg === 'insert') !== null && rows.length <= 3) {
    const csv = require('csv-parser')
    const fs = require('fs')

    const results = [];

    const table = database.table('Winners');

    fs.createReadStream('../files/data.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        await table.insert(results);
      });
  }
})();

