import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./app";
import {ModalContextInterface, ModalContext} from "./ctx";

let EasyModal = (props, context) => {
    let modal: ModalContextInterface = React.useContext(ModalContext);

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

let HelloWorld = (props, context) => {
    let modal: ModalContextInterface = React.useContext(ModalContext);

    let [choice, setChoice] = React.useState('Not set yet');
    let [count, setCount] = React.useState(0);

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

ReactDOM.render(<App><HelloWorld /></App>,
		document.getElementById('content'));

