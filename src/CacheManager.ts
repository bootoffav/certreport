import B24 from './B24';
import { emptyState } from './defaults';
import Task from './Task/Task';

interface ICacheManager {
  staleData: boolean;
  getFromCache: (cacheType: Storage) => any;
  setCaches: any;
}


class CacheManager implements ICacheManager {
  get staleData(): boolean {
    return !sessionStorage.hasOwnProperty('tasks');
  }

  getFromCache = (cacheType: Storage): any => {
    let tasksFromCache: string | null = cacheType.getItem('tasks');
    let productsFromCache: string | null = cacheType.getItem('products');

    tasksFromCache = typeof tasksFromCache === 'string' ? JSON.parse(tasksFromCache) : [];
    productsFromCache = typeof productsFromCache === 'string' ? JSON.parse(productsFromCache) : [];
    return {
      tasksFromCache,
      productsFromCache
    };
  }

  setCaches = ({ tasks, products }: any) => {
    const stringifiedTasks = JSON.stringify(tasks, (k, v) => [
      'readyOn', 'sentOn', 'receivedOn', 'startedOn', 'finishedOn', 'resultsReceived', 'paymentDate'
    ].includes(k) && v !== undefined && v !== null ? v.substr(0, 10) : v);

    localStorage.setItem('tasks', stringifiedTasks);
    sessionStorage.setItem('tasks', stringifiedTasks);
    localStorage.setItem('products', JSON.stringify(products));
    sessionStorage.setItem('products', JSON.stringify(products));

    return { tasks, products };
  }
 
  getFromAPI() {
    interface IFiltered {
      new: {
        ID: string;
      }[];
      old: {}[];
    }

    return B24.get_tasks()
      .then(function (tasks : any) : any {
        let filtered : {
          new: any[],
          old: any[]
        } = {
          new: [],
          old: []
        };

        for (const task of tasks) {
          task.CREATED_BY === '460' ? filtered.new.push(task) : filtered.old.push(task)
        }
        return filtered;
      })
      .then(async (filtered : IFiltered) => {
        let parsedTasks: Task[] = [];

        const interval = () => new Promise(res => setTimeout(() => res(), 2000));

        do {
          const iterable = filtered.new.splice(0, 6)
            .map(task => B24.get_task(task.ID)); //6 is maximum amount of http connections for major browsers;
          parsedTasks = [
            ...parsedTasks,
            ...await interval().then(() => Promise.all(iterable))
          ];
        } while (filtered.new.length !== 0);
        
        filtered.old.forEach((task: any) => {
          task.state = {
            ...emptyState,
            otherTextInDescription: '\n' + task.DESCRIPTION,
            UF_CRM_TASK: task.UF_CRM_TASK
          };
        });
        return [ ...parsedTasks, ...filtered.old] as Task[];
      });
  }
}

export default CacheManager;