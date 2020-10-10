import B24 from './B24';
import { ClientStorage } from './ClientStorage/ClientStorage';

class CacheManager {

    doUpdate = async () => {
        await ClientStorage.updateTasks();
        const { tasks } = await this.getCache();
        await ClientStorage.updateProducts(tasks);
    }

    getCache = async () => await ClientStorage.getData();

    static updateTask = (taskId: string) =>
        B24.get_task(taskId).then(task => ClientStorage.writeData([task]));
}

export default CacheManager;