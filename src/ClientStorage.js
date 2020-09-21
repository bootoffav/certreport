import { without } from 'lodash';
import B24 from './B24';
import { Products } from './Product/Product';

class ClientStorage {

    static async getFromAPI(ids) {
        const fulfilledTasks = [];
        const rejectedTasks = [];

        for (let id of ids) {
            await B24.get_task(id)
                .then(task => fulfilledTasks.push(task))
                .catch(() => rejectedTasks.push(id));
        }

        while (rejectedTasks.length !== 0) {
            const id = rejectedTasks.shift();
            B24.get_task(id)
                .then(task => fulfilledTasks.push(task))
                .catch(() => rejectedTasks.push(id));
        }

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

    static updateProducts(tasks) {
        const { products } = Products(tasks);
        return new Promise(async res => {
            await ClientStorage.writeData(products, 'products');
            res();
        });
    }

    static writeData(data, storeType = 'tasks') {
        return new Promise(res => {
            window.indexedDB.open("default").onsuccess = ({ target }) => {
                const tran = target.result.transaction([storeType], "readwrite");
                const store = tran.objectStore(storeType);
                switch (storeType) {
                    case 'tasks':
                        data.forEach(entity => store.put(entity, entity.ID));
                        break;
                    default:
                        data.forEach(entity => store.put(entity, entity.article));
                }
                tran.oncomplete = () =>
                    res(`${storeType} have written to IndexedDB!`);
                tran.onerror = () => console.error('there was an error');
            };
        });
    }

    static removeData(data) {
        return new Promise(res => {
            window.indexedDB.open("default").onsuccess = ({ target }) => {
                const tran = target.result.transaction(['tasks'], "readwrite");
                const store = tran.objectStore('tasks');
                data.forEach(id => store.delete(id));
                tran.oncomplete = () => {
                    console.log(`tasks ${data} have been erased from IndexedDB!`);
                    res();
                };
            };
        });
    }

    static getExistingKeys(storeType) {
        return new Promise((res) => {
            let request = window.indexedDB.open("default");

            request.onsuccess = (e) => {
                const conn = e.target.result;
                conn.transaction([storeType]).objectStore(storeType).getAllKeys()
                    .onsuccess = (e) => res(e.target.result);
            }
        });
    }

    static getRemoteKeys = () => B24.getTasksID()

    /*
    * returns array id Tasks ID that are not in indexedDB
    */
    static getDBdiffs = () =>
        new Promise(async (res) => {
            const existingKeys = await ClientStorage.getExistingKeys('tasks');
            const remoteKeys = await ClientStorage.getRemoteKeys();
            res({
                addedTasksID: without(remoteKeys, ...existingKeys),
                removedTasksID: without(existingKeys, ...remoteKeys)
            });
        });

    static getData = () =>
        new Promise((res) => {
            const db = window.indexedDB.open("default");

            db.onsuccess = ({ target }) => {
                const db = target.result;

                db.transaction('products').objectStore('products').getAll().onsuccess = ({ target }) => {
                    const products = target.result;
                    db.transaction('tasks').objectStore('tasks').getAll().onsuccess = ({ target }) => {
                        const tasks = target.result;
                        res({ tasks, products });
                    };
                };
            };

            db.onupgradeneeded = (e) => {
                e.target.result.createObjectStore('tasks');
                e.target.result.createObjectStore('products');
            };
        });
}

export { ClientStorage };
