import * as React from "react";

export interface WhoAmIValue {
    is_loaded: boolean;

    // Optional types here, because we know the state
    // at creation will be null.
    is_user?: boolean;
    is_guest?: boolean;
    email?: string;
}

export const WhoAmIContext = React.createContext<WhoAmIValue>({ is_loaded: false });

