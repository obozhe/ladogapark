import { Transition } from '@headlessui/react';
import React from 'react';

import Loader from './Loader';

type Props = {
    isLoading: boolean;
    children: React.ReactNode;
};

const BlockLoader = ({ isLoading, children }: Props) => {
    return (
        <>
            <Transition
                className="z-50 text-white absolute top-0 right-0 left-0 bottom-0 bg-primary bg-opacity-60"
                show={isLoading}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Loader />
            </Transition>

            {children}
        </>
    );
};

export default BlockLoader;
