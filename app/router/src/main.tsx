import * as React from "react";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Counter = (props, context) => {
    let params = useParams();
    return <div>ASDF Count = {params.count} {new Date().getTime()}</div>;
}

const HelloWorld = (props, context) => {
    return (
        <HashRouter>
            <div className='flex flex-col justify-center items-center h-full w-full'>
                <div>Hello World</div>

                <Routes>
                    <Route path="/" element={<div>
                        Cool,
                        <Link to={'/cool'}>COOLCOOL</Link>

                    </div>} />
                    <Route path="/asdf" element={
                        <div>Asdf</div>
                    }>
                    </Route>
                    <Route path="/asdf/:count" element={<Counter/>}/>
                    
                    <Route path="/cool" element={<div>
                        Cool,
                        <Link to={`/asdf/${new Date().getTime()}`}>Click Here</Link>
                        <Link to={'/asdfksjfjdsfa'}>Unknown Place</Link>
                    </div>} />

                    <Route path="*" element={<div>
                        You got lost, return <Link to='/'>home</Link>
                    </div>}/>
                </Routes>

                
                
            </div>
        </HashRouter>
    )
};

import * as ReactDOMClient from 'react-dom/client';
let container = document.getElementById('content');
const root = ReactDOMClient.createRoot(container);
root.render(<HelloWorld />);
