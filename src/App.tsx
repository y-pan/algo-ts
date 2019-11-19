import React from 'react';
import './App.css';
import {AStarPathView} from "./components/AStarPathView";

const App: React.FC = () => {
    return (
        <div className="App">
            {/*<TreeView/>*/}
            <AStarPathView/>
        </div>
    );
};

export default App;
