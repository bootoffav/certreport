import { without } from 'lodash';
import B24 from '../B24';
import { Products } from '../Product/Product';

class ClientStorage {

<<<<<<< HEAD:src/ClientStorage/ClientStorage.ts
    static async getFromAPI(ids: string[]) {
=======
    static async getFromAPI(ids: any) {
>>>>>>> FIX-ClientStorageToTypeScript:src/ClientStorage/ClientStorage.ts
        const fulfilledTasks: any[] = [];
        const rejectedTasks: string[] = [];

        for (let id of ids) {
            await B24.get_task(id)
                .then(task => fulfilledTasks.push(task))
                .catch(() => rejectedTasks.push(id));
        }

<<<<<<< HEAD:src/ClientStorage/ClientStorage.ts
        while (rejectedTasks.length !== 0) {
            const id = rejectedTasks.shift() || '';
            B24.get_task(id)
=======
        rejectedTasks.forEach(async id => {
            await B24.get_task(id)
>>>>>>> FIX-ClientStorageToTypeScript:src/ClientStorage/ClientStorage.ts
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

<<<<<<< HEAD:src/ClientStorage/ClientStorage.ts
    static removeData(data: string[]) {
=======
    static removeData(data: any) {
>>>>>>> FIX-ClientStorageToTypeScript:src/ClientStorage/ClientStorage.ts
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

<<<<<<< HEAD:src/ClientStorage/ClientStorage.ts
    static getExistingKeys(storeType: 'tasks' | 'products'): Promise<string[]> {
        return new Promise((res) => {
=======
    static getExistingKeys(storeType: string) {
        return new Promise<string[]>((res) => {
>>>>>>> FIX-ClientStorageToTypeScript:src/ClientStorage/ClientStorage.ts
            let request = window.indexedDB.open("default");

            request.onsuccess = (e: any) => {
                const conn = e.target.result;
                conn.transaction([storeType]).objectStore(storeType).getAllKeys()
                    .onsuccess = (e: any) => res(e.target.result);
            }
        });
    }

    static getRemoteKeys = () => B24.getTasksID()

    /*
    * returns array id Tasks ID that are not in indexedDB
    */
<<<<<<< HEAD:src/ClientStorage/ClientStorage.ts
    static getDBdiffs = (): Promise<{
        addedTasksID: string[],
        removedTasksID: string[]
    }> =>
        new Promise(async (res) => {
=======
    static getDBdiffs = () =>
        new Promise<{
            addedTasksID: string[];
            removedTasksID: string[];
        }>(async (res) => {
>>>>>>> FIX-ClientStorageToTypeScript:src/ClientStorage/ClientStorage.ts
            const existingKeys = await ClientStorage.getExistingKeys('tasks');
            const remoteKeys = await ClientStorage.getRemoteKeys();
            res({
                addedTasksID: without(remoteKeys, ...existingKeys),
                removedTasksID: without(existingKeys, ...remoteKeys)
            });
        });

<<<<<<< HEAD:src/ClientStorage/ClientStorage.ts
    static getData = (): Promise<{ tasks: any, products: any }> =>
        new Promise((res) => {
            const db = window.indexedDB.open("default");

            db.onsuccess = ({ target }: any) => {
=======
    static getData = () =>
        new Promise<{tasks: any, products: any}>((res) => {
            const db = window.indexedDB.open("default");

            db.onsuccess = ({ target }) => {
                // @ts-ignore
>>>>>>> FIX-ClientStorageToTypeScript:src/ClientStorage/ClientStorage.ts
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
