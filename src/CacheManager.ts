import * as B24 from './B24/B24';
import { ClientStorage } from './ClientStorage/ClientStorage';

class CacheManager {
  doUpdate = async () => {
    if (sessionStorage.getItem('updated') === null) {
      await ClientStorage.updateTasks();
      const { tasks } = await ClientStorage.getData();
      await ClientStorage.updateItems(tasks);
      sessionStorage.setItem('updated', '1');
    }
  };

  // getCache = async () => await ClientStorage.getData();

  static updateTask = (taskId: string) =>
    B24.getTask(taskId).then((task) => ClientStorage.writeData([task]));

  static updateItem = (items: any[]) =>
    ClientStorage.writeData(items, 'products');
}

export default CacheManager;
