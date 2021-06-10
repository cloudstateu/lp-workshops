// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';

function main() {
  const {BigQuery} = require('@google-cloud/bigquery');

  async function queryStackOverflow() {
    const bigqueryClient = new BigQuery({
      projectId: process.env.PROJECT_ID,
      keyFilename: './keyfile.json'
    });

    const sqlQuery = `SELECT
      CONCAT(
        'https://stackoverflow.com/questions/',
        CAST(id as STRING)) as url,
      view_count
      FROM \`bigquery-public-data.stackoverflow.posts_questions\`
      WHERE tags like '%google-bigquery%'
      ORDER BY view_count DESC
      LIMIT 10`;

    const options = {
      query: sqlQuery,
      location: 'US',
    };

    const [rows] = await bigqueryClient.query(options);

    console.log('Query Results:');
    rows.forEach(row => {
      const url = row['url'];
      const viewCount = row['view_count'];
      console.log(`url: ${url}, ${viewCount} views`);
    });
  }
  queryStackOverflow();
}

main(...process.argv.slice(2));