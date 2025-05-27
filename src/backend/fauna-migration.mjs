import { Client, fql, FaunaError } from 'fauna';
import fs from 'fs';

const client = new Client();

const collectionsToExport = ['aitex', 'certification', 'payments', 'standards'];

for (const collectionName of collectionsToExport) {
  try {
    const query = fql`
      let collection = Collection(${collectionName})
      collection.all()`;

    const pages = client.paginate(query);

    const documents = [];
    for await (const page of pages.flatten()) {
      documents.push(page);
    }

    const jsonData = JSON.stringify(documents, null, 2);

    fs.writeFileSync(`${collectionName}.json`, jsonData, 'utf-8');

    console.log(
      `${collectionName} collection data written to ${collectionName}.json`
    );
  } catch (error) {
    if (error instanceof FaunaError) {
      console.error(`Error exporting ${collectionName}:`, error);
    } else {
      console.error(
        `An unexpected error occurred for ${collectionName}:`,
        error
      );
    }
  }
}

client.close();
