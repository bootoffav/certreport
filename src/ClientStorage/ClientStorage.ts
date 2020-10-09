/* eslint-disable import/no-webpack-loader-syntax */
//@ts-ignore
import dataFetcher from 'workerize-loader!../workers/dataFetcher';
import { without } from 'lodash';
import B24 from '../B24';
import { Products } from '../Product/Product';

const worker = dataFetcher();

class ClientStorage {
    static async getFromAPI(ids: any) {
        const fulfilledTasks: any[] = [];
        const rejectedTasks: string[] = [];

        for (let id of ids) {
            await B24.get_task(id)
                .then(task => fulfilledTasks.push(task))
                .catch(() => rejectedTasks.push(id));
        }

        rejectedTasks.forEach(async id => {
            await B24.get_task(id)
                .then(task => fulfilledTasks.push(task))
                .catch(() => rejectedTasks.push(id));
        });

        return fulfilledTasks;
    }

    static updateTasks = () =>
        new Promise(async res => {
            const { addedTasksID, removedTasksID } = await ClientStorage.getDBdiffs();
            let addedTasks = await ClientStorage.getFromAPI(addedTasksID);

            if (addedTasks.length > 0) {
                await ClientStorage.writeData(addedTasks);
            }

            if (removedTasksID.length > 0) {
                await ClientStorage.removeData(removedTasksID);
            }
            res();
        });

    static updateProducts(tasks: any[]) {
        const { products } = Products(tasks);
        return new Promise(async res => {
            await ClientStorage.writeData(products, 'products');
            res();
        });
    }

    static writeData(data: any, storeType = 'tasks') {
        return new Promise(res => {
            window.indexedDB.open("default").onsuccess = ({ target }: any) => {
                const tran = target.result.transaction([storeType], "readwrite");
                const store = tran.objectStore(storeType);
                switch (storeType) {
                    case 'tasks':
                        data.forEach((entity: any) => store.put(entity, entity.ID));
                        break;
                    default:
                        data.forEach((entity: any) => store.put(entity, entity.article));
                }
                tran.oncomplete = () =>
                    res(`${storeType} have written to IndexedDB!`);
                tran.onerror = () => console.error('there was an error');
            };
        });
    }

    static removeData(data: any) {
        return new Promise(res => {
            window.indexedDB.open("default").onsuccess = ({ target }: any) => {
                const tran = target.result.transaction(['tasks'], "readwrite");
                const store = tran.objectStore('tasks');
                data.forEach((id: string) => store.delete(id));
                tran.oncomplete = () => {
                    console.log(`tasks ${data} have been erased from IndexedDB!`);
                    res();
                };
            };
        });
    }

    static getExistingKeys(storeType: string) {
        return new Promise<string[]>((res) => {
            let request = window.indexedDB.open("default");

            request.onsuccess = (e: any) => {
                const conn = e.target.result;
                conn.transaction([storeType]).objectStore(storeType).getAllKeys()
                    .onsuccess = (e: any) => res(e.target.result);
            }
        });
    }

    /*
    * returns array id Tasks ID that are not in indexedDB
    */
    static getDBdiffs = () =>
        new Promise<{
            addedTasksID: string[];
            removedTasksID: string[];
        }>(async (res) => {
            const localIds = await ClientStorage.getExistingKeys('tasks');
            const remoteIds = await new Promise<string[]>((resolve) => {
                worker.getTasksID();
                worker.addEventListener('message', ({data}: any) => resolve(data));
            });
            console.log(localIds, remoteIds);
            res({
                addedTasksID: without(remoteIds, ...localIds),
                removedTasksID: without(localIds, ...remoteIds)
            });
        });

    static getData = () =>
        new Promise<{tasks: any, products: any}>((res) => {
            const db = window.indexedDB.open("default");

            db.onsuccess = ({ target }) => {
                // @ts-ignore
                const db = target.result;

                db.transaction('products').objectStore('products').getAll().onsuccess = ({ target }: any) => {
                    const products = target.result;
                    db.transaction('tasks').objectStore('tasks').getAll().onsuccess = ({ target }: any) => {
                        const tasks = target.result;
                        res({ tasks, products });
                    };
                };
            };

            db.onupgradeneeded = (e: any) => {
                e.target.result.createObjectStore('tasks');
                e.target.result.createObjectStore('products');
            };
        });
}

export { ClientStorage };
