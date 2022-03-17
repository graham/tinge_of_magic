import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./app";

import {WhoAmIContext, WhoAmIValue} from "./ctx";

const HelloWorld = (props, context) => {
    const whoami: WhoAmIValue = React.useContext(WhoAmIContext);
    
    return (
	<div className='flex flex-col justify-center items-center h-full w-full bg-green-100'>
            <div>Hello World!</div>
            <div>Current status: {JSON.stringify(whoami)}</div>
	</div>
    );
}

ReactDOM.render(<App><HelloWorld /></App>,
		document.getElementById('content'));

