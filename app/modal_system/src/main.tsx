import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./app";
import {ModalContextInterface, ModalContext} from "./ctx";

const EasyModal = (props, context) => {
    return <div className={`
                flex w-1/3 h-1/3 rounded-xl bg-white
                justify-center items-center
                `}>
        {props.children}
    </div>
}

const HelloWorld = (props, context) => {
    const modal: ModalContextInterface = React.useContext(ModalContext);
    
    return (
	<div className='flex flex-col justify-center items-center h-full w-full bg-green-100'>
            <div>Hello World!</div>

            <button onClick={ () => {
                modal.pushModal(<EasyModal>Hello World</EasyModal>);
            } }>Show Modal</button>
	</div>
    );
}

ReactDOM.render(<App><HelloWorld /></App>,
		document.getElementById('content'));

