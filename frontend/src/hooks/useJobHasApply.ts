import { useContext } from "react";
import { JobHasApplyContext } from "../contexts/JobHasApply";

export function useJobHasApply() {
    const context = useContext(JobHasApplyContext);
    if (context === undefined) {
        throw new Error('useJobHasApply must be used within a JobHasApplyProvider');
    }
    return context;
}