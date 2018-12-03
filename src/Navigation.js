import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Form from './Form.js';
import List from './List.js';

class Navigation extends React.Component {
    render (){
        return (
            <BrowserRouter>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link className="navbar-brand" to="/">Cert Report</Link>
                    <Link to="/add">Add cert</Link>
                </nav>
                    <Route exact path="/" component={List} />
                    <Route exact path="/add" component={Form} />
                    <Route exact path="/edit/:id" component={Form} />
                </div>
            </BrowserRouter>
        )
    }
}

export default Navigation;