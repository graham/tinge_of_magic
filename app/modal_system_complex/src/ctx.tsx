import * as React from "react";

/* Modal systems are complex, React is complex, mix the two together
   and it ... is still complex. This is going to be a ton of info
   but if you can get through it, you'll understand lots about
   React redraws and modals in general.

   First, our goal is to provide methods defined in ModalContextInterface
   to sub-components all over your application. A module should be able to
   push a modal onto the stack and wait for a promise to resolve in order
   to know the modal has completed.

   Take a look at ModalContextInteface for a better understanding of what
   the methods do and what the promises return.

   The ModalContext Context is a React Context that passes references
   to methods down to our consumers, this makes the interface with our
   modal system as easy as passing a HTMLElement to pushModal and
   awaiting a promise resolution.

   We nest the actual functions and state in the ModalStackView, this does
   two primary things:

   1. Contains all modal logic in once place.
   2. Prevents redraws of the parent app when the modals change, and prevents
      redraws of the modals when the core app changes.

   #2 is something that React tries to give you for free, but it's easy to
   get in the way, and thus often React will redraw your component when
   you don't want it to. This is a very complex topic, and one that most
   people get wrong.

   We use a ref so that we can maintain a reference to the ModalStackView
   object, with it's state intacted, and retrieve function pointers (sort of)
   that we can then embed in the context.

   State transitions in the modalStack result in re-renders of only the
   modal part of the dom tree, and shouldn't result in any other redraws.
 */

export interface ModalContextInterface {
    // Push a modal onto the stack, when that modal is removed
    // the promise will resolve with the value given to whatever
    // method resulted in the modal being dismissed.
    pushModal: (d: any) => Promise<any>

    // Pop the top modal off the stack, resolve it's promise with
    // completionValue. If the stack is empty, no more modal will
    // be shown.
    popModal: (completionValue?: any) => unknown,

    // Pop the top modal off the stack, resolve it's promise
    // push a new modal onto the stack.
    swapModal: (newModal: any, completionValue?: any) => Promise<any>,

    // Resolve all modal promises with completionValue and clear the
    // stack.
    clearModals: (completionValue?: any) => unknown,

    // Resolve all modal promises, clear the stack, push on a new
    // modal and return a promise attached to that modal.
    clearAndPushModal: (d: any, completionValue?) => Promise<any>,
}

/* This class is given default implementations that will exist until
   the ref for the actual ModalStackView resolves */
export const ModalContext = React.createContext<ModalContextInterface>({
    // These are stubs you can ignore.    
    pushModal: (d: any):Promise<any> => {
        return new Promise((res, rej) => res(undefined));
    },
    popModal: (completionValue?: any) => {},
    swapModal: (newModal: any, completionValue?: any): Promise<any> => {
        return new Promise((res, rej) => res(undefined));
    },
    clearModals: (completionValue?: any) => {},
    clearAndPushModal: (d: any, completionValue?: any): Promise<any> => {
        return new Promise((res, rej) => res(undefined));
    },
});


// The HTML element that represents the modal and the function
// that should be called when the modal is removed from the screen
// for now, this results in the initial promise created when the
// modal was created being completed. Since I can't determine
// the right semantics for resolution/rejection of a promise in this
// case. I assume that the promise will always resolve and the engineer
// must determine the meaning of the values they are adding.
export type ModalStackItem = [HTMLElement, Function];


/* A class component makes it easier to expose methods "above"
   this component. It's a little more complicated to manage state, but
   creating an interface with a functional component is less ergonomic
   and not really what functional components are for.

   The goal here is to contain all the modal state inside a single
   component and to have that component manage it's own redraws without
   resulting in other components being redraw needlessly.
*/ 
class ModalStackView extends React.Component<any, any>  implements ModalContextInterface  {
    state = {
        modalStack: [],
    };

    pushModal(d): Promise<any> {
        return new Promise( (res, rej) => {
            let item:ModalStackItem = [d, res];
            this.setState((ps, ctx) => {
                return {...ps, modalStack: ps.modalStack.concat([item])};
            });
        });
    }

    popModal(completionValue?:any) {
        return new Promise( (res, rej) => {
            this.setState((ps, ctx) => {
                if (ps.modalStack.length > 0) {
                    let [oldModalDiv, completeFn] = ps.modalStack[ps.modalStack.length-1];
                    completeFn(completionValue);
                    return {...ps, modalStack: ps.modalStack.slice(0, ps.modalStack.length - 1)};
                }
                return ps;
            });
        });
    }

    swapModal(d: any, completionValue?: any):Promise<any> {
        return new Promise((res, rej) => {
            let newModal: ModalStackItem = [d, res];

            this.setState((ps, ctx) => {
                if (ps.modalStack.length > 0) {
                    let [oldModalDiv, completeFn] = ps.modalStack[ps.modalStack.length-1];
                    completeFn(completionValue);
                    return {...ps, modalStack: ps.modalStack.slice(0, ps.modalStack.length - 1).concat([newModal])};
                }
                return ps;
            });
        });
    }

    clearModals(completionValue?:any) {
        this.state.modalStack.forEach(([modalDiv, completeFn]) => {
            completeFn(completionValue);
        });
        this.setState((ps, ctx) => {
            return {...ps, modalStack: []};
        });
    }

    clearAndPushModal(d:any, completionValue?:any): Promise<any> {
        this.state.modalStack.forEach(([modalDiv, completeFn]) => {
            completeFn(completionValue);
        });
        return new Promise( (res, rej) => {
            let item:ModalStackItem = [d, res];
            this.setState((ps, ctx) => {
                return {...ps, modalStack: ps.modalStack.concat([item])};
            });
        });
    }
    
    render() {
        let item = <></>;

        if (this.state.modalStack.length > 0) {
            let [component, _fn] = this.state.modalStack[this.state.modalStack.length-1];
            item = component;
        }

        return (
            <div
                className={`
		      flex overflow-auto w-screen flex-col
		      h-screen justify-start items-start
                      bg-gray-200 bg-opacity-75 fixed
                      backdrop-filter backdrop-blur-sm
		      z-30 top-0 right-0 left-0 bottom-0 
                      ${this.state.modalStack.length == 0 ? "hidden" : ""}
	        `}
            >
                <div className="flex h-1/6"></div>
                <div className="flex w-full h-full items-start justify-center">
                    {item}
                </div>
            </div>
        );
    }
}

export const ModalController = (props) => {
    let msvRef = React.useRef<any>();
    let [methods, setMethods] = React.useState<any>();

    React.useEffect( () => {
        setMethods(msvRef.current);
    }, [msvRef]);
    
    return (
        <ModalContext.Provider value={methods}>
            <>{props.children}</>
            <ModalStackView ref={msvRef}/>
        </ModalContext.Provider>
    );
};
