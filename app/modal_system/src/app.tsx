import * as React from "react";
import * as ReactDOM from "react-dom";

import {ModalController, ModalContextInterface} from "./ctx";

export const App = (props, context) => {
    const modalRef = React.useRef<ModalContextInterface>();
    
    return (
        <ModalController ref={modalRef}>
            <div className='bg-red-100 w-full h-full'>
                {props.children}
            </div>
        </ModalController>
    );
};
