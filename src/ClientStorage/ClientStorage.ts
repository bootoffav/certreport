/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import dataFetcher from 'workerize-loader!../workers/dataFetcher';
import { Products } from '../Product/Product';

const worker = dataFetcher();

class ClientStorage {
    static updateTasks = () =>
        new Promise(resolve => {
            worker.onmessage = async ({ data }: MessageEvent) => {
                if (Array.isArray(data)) {
                    await ClientStorage.removeData();
                    ClientStorage.writeData(data).then(resolve);
                }
            }
            worker.getTasks();
        })

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
                        data.forEach((entity: any) => store.put(entity, entity.id));
                        break;
                    default:
                        data.forEach((entity: any) => store.put(entity, entity.article));
                }
                tran.oncomplete = () => res();
                tran.onerror = () => console.error('there was an error');
            };
        });
    }

    static removeData = () => new Promise(res => {
            window.indexedDB.open("default").onsuccess = ({ target }: any) => {
                const tran = target.result.transaction(['tasks'], "readwrite");
                tran.oncomplete = () => res();
                tran.objectStore('tasks').clear();
            };
        });

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