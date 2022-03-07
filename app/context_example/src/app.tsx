import * as React from "react";
import * as ReactDOM from "react-dom";

import {WhoAmIContext, WhoAmIValue} from "./ctx";

export const App = (props, context) => {
    let [who, setWho]: [WhoAmIValue, any] = React.useState(
        { is_loaded: false }
    );

    // This will run at "mount" time, and then sleep for 1000ms
    // and then run the setWho command.
    React.useEffect( () => {
        setTimeout( () => {
            setWho({
                is_loaded: true,
                is_user: true,
                is_guest: false,
                email: "test@example.com",
            });
        }, 1000);
    }, []);
    
    return (<div className='bg-red-100 w-full h-full p-4'>
        <WhoAmIContext.Provider value={who}>
            {props.children}
        </WhoAmIContext.Provider>
    </div>);
};
