import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import { Error404Page } from 'tabler-react';
import CacheManager from '../../CacheManager';
import List from '../List/List';
import Form from '../Form/Form';
import Dashboard from '../Dashboard/Dashboard';
import ErrorBoundary from '../../ErrorBoundary';
import { Products } from '../../Product/Product';
import BrandFilter from '../Filters/BrandFilter';
import DateFilter from '../Filters/DateFilter';

class Main extends React.Component {
    cache: CacheManager;
    state: {
        allTasks: any;
        allProducts: any;
        filtered: any;
        startDate?: Date;
        endDate?: Date;
        activeBrands: string[];
    }

    constructor(props: any) {
        super(props);
        this.cache = new CacheManager();
        const fromCache = this.cache.staleData ? this.cache.getFromCache(localStorage) : this.cache.getFromCache(sessionStorage);
        this.state = {
            allTasks: fromCache.tasksFromCache,
            allProducts: fromCache.productsFromCache,
            filtered: fromCache.tasksFromCache,
            activeBrands: ['XMT', 'XMS', 'XMF']
        };
    }

    componentDidMount() {
        if (this.cache.staleData) {
            this.cache.getFromAPI() // get Tasks
                .then(Products) // parse Products
                .then(this.cache.setCaches)
                .then(({ tasks, products }) => this.setState({ allTasks: tasks, allProducts: products }));
            }
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevState.activeBrands !== this.state.activeBrands || prevState.startDate !== this.state.startDate || prevState.endDate !== this.state.endDate) {
            this.filter();
        }
    }

    filter() {
        let { allTasks, activeBrands, startDate, endDate } = this.state;

        // brandfiltering
        let filtered = allTasks.filter((task: any) => {
            if (task.state.brand === '') {
                if (activeBrands.includes('No brand')) return true;
            }
            return activeBrands.includes(task.state.brand);
        });

        // datefiltering
        if (startDate && endDate) {
            filtered = filtered.filter((task: any) => {
                const comparingDate = new Date(task.state.certReceivedOnRealDate);
                // @ts-ignore
                return startDate < comparingDate && endDate > comparingDate;
            });
        }

        this.setState({
            filtered
        });
    }

    static Loading = () => 
        <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
        </div>

    render() {
        return (
            <Router>
                <div className="container-fluid">
                    <div className="pl-1 mb-1 rounded-bottom navbar-light d-flex justify-content-start">
                        <BrandFilter
                            tasks={this.state.allTasks}
                            update={this.setState.bind(this)}
                        />
                        <DateFilter
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            update={this.setState.bind(this)}
                        />
                        <div className="container">
                            <div className="d-flex h-100 justify-content-end align-items-center pt-2" style={{ fontSize: '16px' }}>
                                <div>
                                    <NavLink className="navbar-link" exact to="/dashboard">
                                        <p>Dashboard</p>
                                    </NavLink>
                                </div>
                                <div className="mx-2">
                                    <NavLink className="navbar-link" to="/">
                                        <p>Certification list</p>
                                    </NavLink>
                                </div>
                                <div>
                                    <NavLink exact to="/add">
                                        <p>Add cert</p>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Switch>
                        <Route exact path="/dashboard"
                            render={() => <Dashboard
                                tasks={this.state.filtered}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                            />} />
                        <Route exact path="/" render={() => <List
                            allTasks={this.state.filtered}
                            allProducts={this.state.allProducts}
                            staleData={this.cache.staleData}
                        />} />
                        <Route exact path="/add" render={({ match, location: { state } }) =>
                            <Form
                                match={match}
                                state={state} />}
                        />
                        <Route exact path="/edit/:id" render={({ match, location: { state } }) =>
                            <ErrorBoundary>
                                <Form
                                    match={match}
                                    state={state}
                                />
                            </ErrorBoundary>
                        } />
                        <Route path="*" component={Error404Page} />
                    </Switch>
                </div>
            </Router>);
    }
}

export default Main;