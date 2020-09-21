import B24 from './B24';
import { ClientStorage } from './ClientStorage';

interface ICacheManager {
    getCache: (cacheType: Storage) => any;
    staleData: boolean;
    setCaches: any;
}


class CacheManager {

    doUpdate = async () => {
        await ClientStorage.updateTasks();
        const { tasks } = await this.getCache();
        await ClientStorage.updateProducts(tasks);
    }

    getCache = async () => await ClientStorage.getData();

    static updateTask = (taskId: string) =>
        B24.get_task(taskId).then(task => ClientStorage.writeData([ task ]))
}

export default CacheManager;