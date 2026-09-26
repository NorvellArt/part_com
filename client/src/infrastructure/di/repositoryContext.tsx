'use client';

import React, { createContext, useContext } from 'react';
import { IProductRepository } from '@/domain/repositories/iProductRepository';
import { ApiProductRepository } from '@/infrastructure/repositories/apiProductRepository';

interface RepositoryContextType {
    productRepository: IProductRepository;
}

const RepositoryContext = createContext<RepositoryContextType | null>(null);

interface RepositoryProviderProps {
    children: React.ReactNode;
    productRepository?: IProductRepository;
}

export const RepositoryProvider: React.FC<RepositoryProviderProps> = ({
    children,
    productRepository = new ApiProductRepository(),
}) => {
    return <RepositoryContext.Provider value={{ productRepository }}>{children}</RepositoryContext.Provider>;
};

export const useRepositories = (): RepositoryContextType => {
    const context = useContext(RepositoryContext);
    if (!context) {
        throw new Error('useRepositories must be used within a RepositoryProvider');
    }
    return context;
};
