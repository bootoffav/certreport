import { parseDates } from './Helpers';
import B24 from './B24';
import { emptyState } from './defaults';
import React from 'react';
import Loader from 'react-loader-spinner';
import ReactDOM from 'react-dom';


class CacheManager {
  async load() {
    let tasks;
    if (sessionStorage.hasOwnProperty('tasks')) {
      return this.getFromCache(sessionStorage);
    }
    if (localStorage.hasOwnProperty('tasks')) {

      setTimeout(async () => {
        document.getElementById('cacheStateLabel').innerHTML = 'contacting Bitrix24, receiving updates';
        ReactDOM.render(
          <Loader type='Circles' color='blueviolet' height='30' width='30'/>,
          document.getElementById('cacheStateLoader')
        );
        let tasks = await this.getFromAPI();
        this.setCaches(tasks);
        window.location.reload();
      }, 0);

      return this.getFromCache(localStorage);
    }

    tasks = await this.getFromAPI();
    this.setCaches(tasks);

    return tasks;
  }

  getFromCache = cacheType => JSON.parse(cacheType.getItem('tasks'))
    .map(task => {
      task.state = { ...task.state, ...parseDates(task.state, 'YYYY-MM-DD') };
      return task;
  });

  setCaches = tasks => {
    let stringifiedTasks = this.prefareForCaching(tasks);
    localStorage.setItem('tasks', stringifiedTasks);
    sessionStorage.setItem('tasks', stringifiedTasks);
  }

  prefareForCaching = tasks => JSON.stringify(tasks, (k, v) => [
    'sentOn', 'receivedOn', 'startedOn', 'finishedOn', 'resultsReceived', 'paymentDate'
  ].includes(k) && v !== undefined && v !== null ? v.substr(0, 10) : v);


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