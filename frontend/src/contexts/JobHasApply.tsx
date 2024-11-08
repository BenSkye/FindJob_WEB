import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getPersonalJobHasApplied } from '../services/api/applicationService';
import { useAuth } from '../hooks/useAuth';

// Define the type for a job application


// Define the context type
interface JobHasApplyContextType {
    appliedJobs: string[];
    addAppliedJob: (jobId: string) => void;
    removeAppliedJob: (jobId: string) => void;
    hasApplied: (jobId: string) => boolean;
    getAppliedJobs: () => Promise<void>;
}

// Create the context
export const JobHasApplyContext = createContext<JobHasApplyContextType | undefined>(undefined);

// Create the provider component
export function JobHasApplyProvider({ children }: { children: ReactNode }) {
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

    const { user } = useAuth();

    const fetchAppliedJobs = async () => {
        console.log('user', user);
        if (user && user.roles.includes('candidate')) {
            const response = await getPersonalJobHasApplied();
            setAppliedJobs(response.metadata);
        }
    }

    useEffect(() => {
        if (user) {
            fetchAppliedJobs();
        } else {
            setAppliedJobs([]);
        }
    }, [user]);

    const getAppliedJobs = async () => {
        const response = await getPersonalJobHasApplied();
        setAppliedJobs(response.metadata);
    }

    const addAppliedJob = (jobId: string) => {
        setAppliedJobs(prev => [...prev, jobId]);
    };

    // const removeAppliedJob = (jobId: string) => {
    //     setAppliedJobs(prev => prev.filter(job => job.jobId !== jobId));
    // };

    // const hasApplied = (jobId: string) => {
    //     return appliedJobs.some(job => job.jobId === jobId);
    // };

    return (
        <JobHasApplyContext.Provider
            value={{ appliedJobs, addAppliedJob, getAppliedJobs }}
        >
            {children}
        </JobHasApplyContext.Provider>
    );
}

// Custom hook to use the context
