import B24 from './B24';
import { ClientStorage } from './ClientStorage/ClientStorage';

class CacheManager {
  doUpdate = async () => {
    if (sessionStorage.getItem('updated') === null) {
      await ClientStorage.updateTasks();
      const { tasks } = await this.getCache();
      await ClientStorage.updateProducts(tasks);
      sessionStorage.setItem('updated', '1');
    }
  };

  getCache = async () => await ClientStorage.getData();

  static updateTask = (taskId: string) =>
    B24.getTask(taskId).then((task) => ClientStorage.writeData([task]));
}

export default CacheManager;
