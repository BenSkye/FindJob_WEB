import { useContext } from "react";
import { SubcriptionContext } from "../contexts/Subscription";

export function useSubscription() {
    const context = useContext(SubcriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubcriptionProvider');
    }
    return context;
}