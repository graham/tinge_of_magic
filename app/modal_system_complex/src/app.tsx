import * as React from "react";
import * as ReactDOM from "react-dom";

import {ModalController, ModalContextInterface} from "./ctx";

export const App = (props, context) => {
    return (
        <ModalController>
            <div className='bg-red-100 w-full h-full'>
                {props.children}
            </div>
        </ModalController>
    );
};
