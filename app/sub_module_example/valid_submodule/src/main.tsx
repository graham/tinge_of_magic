import * as React from "react";
import * as ReactDOM from "react-dom";

const HelloWorld = (
    <div className='flex flex-col justify-center items-center h-full w-full'>
        Inside a sub module. { new Date().toString() }
    </div>
);

ReactDOM.render(HelloWorld,
		document.getElementById('content'));

