import { createContext, useContext, useEffect, useState } from "react";

const stepContext = createContext();
const stepSetContext = createContext();

export function useStepContext() {
    return useContext(stepContext);
}

export function useStepSetContext() {
    return useContext(stepSetContext);
}

export function StepProvider({ children }) {
    const [_Step, setStep] = useState(0);
    useEffect(() => {
        setStep(0);
    }, []);

    return (
        <stepContext.Provider value={_Step}>
            <stepSetContext.Provider value={setStep}>
                {children}
            </stepSetContext.Provider>
        </stepContext.Provider>
    );
}