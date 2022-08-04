// @ts-nocheck
/* eslint-disable import/no-webpack-loader-syntax */
import dataFetcher from 'workerize-loader!../workers/dataFetcher';
// import { Items, ItemType } from 'Item/Item';

const worker = dataFetcher();

class ClientStorage {
  static getTasks = () =>
    new Promise<any[]>((resolve) => {
      worker.onmessage = ({ data }: MessageEvent) => {
        if (Array.isArray(data)) {
          return resolve(data);
        }
      };
      worker.getTasks();
    });

  // static updateItems(tasks: any[]) {
  //   const { items } = Items(tasks);
  //   return new Promise((resolve) =>
  //     ClientStorage.removeData('products')
  //       .then(ClientStorage.writeData(items, 'products'))
  //       .then(resolve)
  //   );
  // }

  // static writeData(data: any, storeType = 'tasks') {
  //   return new Promise((res) => {
  //     window.indexedDB.open('default').onsuccess = ({ target }: any) => {
  //       const tran = target.result.transaction([storeType], 'readwrite');
  //       const store = tran.objectStore(storeType);
  //       switch (storeType) {
  //         case 'tasks':
  //           data.forEach((entity: any) => store.put(entity, entity.id));
  //           break;
  //         default:
  //           data.forEach((entity: any) => store.put(entity, entity.article));
  //       }
  //       tran.oncomplete = () => res();
  //       tran.onerror = () => console.error('there was an error');
  //     };
  //   });
  // }

  // static removeData = (type: 'products' | 'tasks') =>
  //   new Promise((res) => {
  //     window.indexedDB.open('default').onsuccess = ({ target }: any) => {
  //       const tran = target.result.transaction([type], 'readwrite');
  //       tran.oncomplete = () => res();
  //       tran.objectStore(type).clear();
  //     };
  //   });

  // static getExistingKeys(storeType: string) {
  //   return new Promise<string[]>((res) => {
  //     let request = window.indexedDB.open('default');

  //     request.onsuccess = (e: any) => {
  //       const conn = e.target.result;
  //       conn
  //         .transaction([storeType])
  //         .objectStore(storeType)
  //         .getAllKeys().onsuccess = (e: any) => res(e.target.result);
  //     };
  //   });
  // }

  // static getSpecificItem = (
  //   key: string,
  //   storageType = 'tasks'
  // ): Promise<ItemType> => {
  //   return new Promise((res, rej) => {
  //     const db = window.indexedDB.open('default', 2);

  //     db.onsuccess = ({ target }) => {
  //       const db = target.result;

  //       db
  //         .transaction(storageType)
  //         .objectStore(storageType)
  //         .get(key).onsuccess = ({ target }: any) => {
  //         res(target.result);
  //       };
  //     };
  //   });
  // };

  // static getData = () =>
  //   new Promise<{ tasks: any; items: any }>((res) => {
  //     const db = window.indexedDB.open('default', 2);

  //     db.onsuccess = ({ target }) => {
  //       const db = target.result;

  //       db.transaction('products').objectStore('products').getAll().onsuccess =
  //         ({ target }: any) => {
  //           const items = target.result;
  //           db.transaction('tasks').objectStore('tasks').getAll().onsuccess = ({
  //             target,
  //           }: any) => {
  //             const tasks = target.result;
  //             res({ tasks, items });
  //           };
  //         };
  //     };

  //     db.onupgradeneeded = (e: any) => {
  //       const objectStores = Array.from(e.target.result.objectStoreNames);

  //       if (objectStores.length > 0) {
  //         objectStores.forEach((obs: any) => {
  //           e.target.result.deleteObjectStore(obs);
  //           e.target.result.createObjectStore(obs);
  //         });
  //       } else {
  //         e.target.result.createObjectStore('tasks');
  //         e.target.result.createObjectStore('products');
  //       }

  //       sessionStorage.removeItem('updated');
  //     };
  //   });
}

export default ClientStorage;
