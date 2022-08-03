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

  static updateTask = (task: any) => ClientStorage.writeData([task]);

  static updateItem = (items: any[]) =>
    ClientStorage.writeData(items, 'products');
}

export default CacheManager;
