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

    static async updateOneTask(taskId: string) {
        const task = await B24.get_task(taskId);
        return await ClientStorage.writeData([ task ]);
    }
}

export default CacheManager;