import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getPersonalJobHasApplied } from '../services/api/applicationService';
import { useAuth } from '../hooks/useAuth';
import { getPersonalSubcriptions } from '../services/api/subscriptionService';

// Define the type for a job application


// Define the context type
interface SubcriptionContextType {
    subcription: any;
    getSubcriptions: () => Promise<void>;
}

// Create the context
export const SubcriptionContext = createContext<SubcriptionContextType | undefined>(undefined);

// Create the provider component
export function SubcriptionProvider({ children }: { children: ReactNode }) {
    const [subcription, setSubcription] = useState<any>(null);

    const { user } = useAuth();

    const fetchSubcriptions = async () => {
        console.log('user', user);
        if (user && user.roles.includes('employer')) {
            const response = await getPersonalSubcriptions();
            console.log('response28', response);
            setSubcription(response.metadata);
        }
    }

    useEffect(() => {
        if (user && user.roles.includes('employer')) {
            fetchSubcriptions();
        } else {
            setSubcription(null);
        }
    }, [user]);

    const getSubcriptions = async () => {
        const response = await getPersonalSubcriptions();
        setSubcription(response.metadata);
    }

    // const removeAppliedJob = (jobId: string) => {
    //     setAppliedJobs(prev => prev.filter(job => job.jobId !== jobId));
    // };

    // const hasApplied = (jobId: string) => {
    //     return appliedJobs.some(job => job.jobId === jobId);
    // };

    return (
        <SubcriptionContext.Provider
            value={{ subcription, getSubcriptions }}
        >
            {children}
        </SubcriptionContext.Provider>
    );
}

// Custom hook to use the context
