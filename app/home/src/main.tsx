import * as React from "react";
import * as ReactDOM from "react-dom";

let HelloWorld = (
    <div className='flex flex-col justify-center items-center h-full w-full'>
        Hello World!
    </div>
);

ReactDOM.render(HelloWorld,
		document.getElementById('content'));

