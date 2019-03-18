import { parseDates } from './Helpers';
import B24 from './B24';
import { emptyState } from './defaults';


class CacheManager {

  async load() {
    if (sessionStorage.hasOwnProperty('tasks')) {
      return this.getSessionCache()
    }
    let tasks = await this.getFromAPI();

    let stringifiedTasks = this.prefareForCaching(tasks);
    this.setSessionCache(stringifiedTasks);
    this.setLocalCache(stringifiedTasks);

    return tasks;
  }

  getSessionCache() {
    let tasks = JSON.parse(sessionStorage.getItem('tasks'))
      .map(task => {
        task.state = { ...task.state, ...parseDates(task.state, 'YYYY-MM-DD') };
        return task;
      });
    return tasks;
  }

  getLocalCache() {

  }

  setLocalCache = tasks => {
    localStorage.setItem('tasks', tasks);
    return tasks;
  }

  prefareForCaching(tasks) {
    return JSON.stringify(tasks, (k, v) => [
      'sentOn',
      'receivedOn',
      'startedOn',
      'finishedOn',
      'resultsReceived', 'paymentDate'
    ].includes(k) && v !== undefined && v !== null ? v.substr(0, 10) : v);
  }

  setSessionCache = tasks => {
    sessionStorage.setItem('tasks', tasks);
    return tasks;
  }

  getFromAPI() {
    return B24.get_tasks()
      .then(tasks => {
        let filtered = {
          new: [],
          old: []
        };
        tasks.forEach(task => (task.CREATED_BY === '460') ? filtered.new.push(task) : filtered.old.push(task))
        return filtered;
      })
      .then(async filtered => {
        let task, parsedTasks = [];

        for (let i = 0; i < filtered.new.length; i++) {
          task = await B24.get_task(filtered.new[i].ID);
          parsedTasks.push(task);
        }
        filtered.old.forEach(task => {
          task.state = { ...emptyState };
          task.state.otherTextInDescription = '\n' + task.DESCRIPTION;
          task.state.UF_CRM_TASK = task.UF_CRM_TASK;
        });
        return [ ...parsedTasks, ...filtered.old];
      });
  }
}

export default CacheManager;