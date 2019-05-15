import B24 from './B24';
import { emptyState } from './defaults';
import Task from './Task/Task';

interface ICacheManager {
  // load: () => any;
  staleData: boolean;
  getFromCache: (cacheType: Storage) => Task[];
  setCaches: (tasks: Task[]) => void;
}


class CacheManager implements ICacheManager {
  // load() {
  //   if (sessionStorage.hasOwnProperty('tasks')) {
  //     return this.getFromCache(sessionStorage);
  //   }
  //   if (localStorage.hasOwnProperty('tasks')) {
  //     return this.getFromCache(localStorage);
  //   }

  // }

  get staleData() : boolean {
    return !sessionStorage.hasOwnProperty('tasks');
  }

  getFromCache = (cacheType: Storage) : Task[] => {
    const fromCache: string | null = cacheType.getItem('tasks');
    if (typeof fromCache === 'string') {
      return JSON.parse(fromCache);
    }
    return [];
  }

  setCaches = (tasks : Task[]) => {
    const stringifiedTasks = JSON.stringify(tasks, (k, v) => [
      'readyOn', 'sentOn', 'receivedOn', 'startedOn', 'finishedOn', 'resultsReceived', 'paymentDate'
    ].includes(k) && v !== undefined && v !== null ? v.substr(0, 10) : v);

    localStorage.setItem('tasks', stringifiedTasks);
    sessionStorage.setItem('tasks', stringifiedTasks);
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

        do {
          const iterable = filtered.new.splice(0, 6)
            .map(task => B24.get_task(task.ID)); //6 is maximum amount of http connections for major browsers;
          parsedTasks = [...parsedTasks, ...await Promise.all(iterable)];
        } while (filtered.new.length !== 0);
        
        filtered.old.forEach((task: any) => {
          task.state = { ...emptyState };
          task.state.otherTextInDescription = '\n' + task.DESCRIPTION;
          task.state.UF_CRM_TASK = task.UF_CRM_TASK;
        });
        return [ ...parsedTasks, ...filtered.old] as Task[];
      });
  }
}

export default CacheManager;