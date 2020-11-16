import * as B24 from './B24/B24';
import { ClientStorage } from './ClientStorage/ClientStorage';
import { Items } from './Item/Item';

class CacheManager {
  doUpdate = async () => {
    if (sessionStorage.getItem('updated') === null) {
      await ClientStorage.updateTasks();
      const { tasks } = await this.getCache();
      await ClientStorage.updateItems(tasks);
      sessionStorage.setItem('updated', '1');
    }
  };

  getCache = async () => await ClientStorage.getData();

  static updateTask = (taskId: string) =>
    B24.getTask(taskId).then((task) => ClientStorage.writeData([task]));

  static updateItem = async (item: string, tasks: any[]) => {
    for (let i = 0; i < tasks.length; i++) {
      tasks[i] = await B24.getTask(tasks[i].id);
    }
    const { items } = Items(tasks);
    ClientStorage.writeData(items, 'products');
    return items[0];
  };
}

export default CacheManager;
