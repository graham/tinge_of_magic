import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./app";
import {ModalContextInterface, ModalContext} from "./ctx";

const EasyModal = (props, context) => {
    const modal: ModalContextInterface = React.useContext(ModalContext);

    console.log("Draw Modal");

    return <div className={`
                flex w-1/3 h-1/3 rounded-xl bg-white
                justify-center items-center flex-row space-x-5
    `}>
        <div>Hello!</div>
        <a href="#" onClick={ () => modal.popModal('Chose number one') }>One</a>
        <a href="#" onClick={ () => modal.popModal('Chose number two') }>Two</a>        
    </div>
}

const HelloWorld = (props, context) => {
    const modal: ModalContextInterface = React.useContext(ModalContext);

    const [choice, setChoice] = React.useState('Not set yet');
    const [count, setCount] = React.useState(0);

    console.log("Draw Hello World");

    React.useEffect( () => {
        setTimeout( () => {
            setCount(p => p + 1);
        }, 5000);
    }, [count]);
    
    return (
	<div className='flex flex-col justify-center items-center h-full w-full bg-green-100'>
            <div>Welcome to the more complex version</div>

            <button onClick={ () => {
                modal.pushModal(<EasyModal />).then( (choice) => {
                    setChoice(choice);
                });
            } }>Show Modal</button>

            <div>Current Choice: <b>{choice}</b></div>
            <div>Count: {count}</div>
	</div>
    );
}

import * as ReactDOMClient from 'react-dom/client';
let container = document.getElementById('content');
const root = ReactDOMClient.createRoot(container);
root.render(<App><HelloWorld /></App>);
