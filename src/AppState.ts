import React from 'react';
import CacheManager from './CacheManager';

class AppState {
  cache: CacheManager;
  allTasks: any;

  constructor() {
    this.cache = new CacheManager();
    this.allTasks = this.cache.getFromCache(localStorage)

    if (this.cache.staleData) {
      this.getFromAPI();
    }
  }

  getFromAPI() {
    this.cache.getFromAPI()
    .then(tasks => {
      this.allTasks = tasks;
      return tasks;
    })
    .then(this.cache.setCaches)
      // .then(() => window.location.reload());
    return [];
  }

}

const AppContext = React.createContext({});


export { AppContext, AppState };