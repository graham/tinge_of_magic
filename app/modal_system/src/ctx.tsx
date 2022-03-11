import * as React from "react";

export interface ModalContextInterface {
    pushModal: (d: any) => unknown
    popModal: () => unknown,
    swapModal: (newModal: any) => unknown,
    clearModals: () => unknown,
    clearAndPushModal: (d: any) => unknown
}

export const ModalContext = React.createContext<ModalContextInterface>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    pushModal: (d: any) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    popModal: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    swapModal: (newModal: any) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clearModals: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clearAndPushModal: (d: any) => {},
});

export const ModalStackView = (props, context) => {
    return (
        <div
            className={`
		      flex overflow-auto w-screen flex-col
		      h-screen justify-start items-start
                      bg-gray-200 bg-opacity-75 fixed
                      backdrop-filter backdrop-blur-sm
		      z-30 top-0 right-0 left-0 bottom-0 
                      ${props.modalStack.length == 0 ? "hidden" : ""}
	    `}
        >
            <div className="flex h-1/6" key="spacer"></div>
            <div className="flex w-full h-full items-start justify-center" key="content">
                {props.modalStack[props.modalStack.length - 1]}
            </div>
        </div>
    );
};

export const ModalController = React.forwardRef<ModalContextInterface, {children: React.ReactNode}>(
    (props, ref:any) => {
        const [modalStack, setModalStack] = React.useState([]);

        const pushModal = (d) => {
            setModalStack(modalStack.concat(d));
        };

        const clearAndPushModal = (d) => {
            setModalStack([d]);
        };

        const swapModal = (newModal) => {
            setModalStack((prevStack) => {
                if (prevStack.length > 0) {
                    return prevStack
                        .slice(0, prevStack.length - 1)
                        .concat(newModal);
                } else {
                    return prevStack;
                }
            });
        };

        const popModal = () => {
            setModalStack((prevStack) => {
                if (prevStack.length > 0) {
                    return prevStack.slice(0, prevStack.length - 1);
                } else {
                    return prevStack;
                }
            });
        };

        const clearModals = () => {
            setModalStack([]);
        };

        const methods = {
            pushModal: pushModal,
            popModal: popModal,
            swapModal: swapModal,
            clearModals: clearModals,
            clearAndPushModal: clearAndPushModal,
        };

        ref.current = methods;

        return (
            <ModalContext.Provider value={methods}>
                {props.children}
                <ModalStackView modalStack={modalStack} />
            </ModalContext.Provider>
        );
});
