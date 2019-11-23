import React from "react";
import {Link, Route, Router, Switch} from "react-router-dom";
import {AStarPathView} from "./components/AStarPathView";
import {TreeView} from "./components/TreeView";
import {createBrowserHistory} from "history";

const history = createBrowserHistory();

const Routers: React.FC = () => {
    return (
        <Router history={history}>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/astar">A Star Path Finding</Link>
                        </li>
                        <li>
                            <Link to="/tree">Red Black Binary Search Tree</Link>
                        </li>
                    </ul>
                </nav>

                <Switch>
                    <Route path="/astar">
                        <AStarPathView/>
                    </Route>
                    <Route path="/tree">
                        <TreeView/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};
export default Routers;
//
// class Routers extends React.Component {
//     render(): JSX.Element {
//     }
// }