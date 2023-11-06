import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

type Props = {
  steps: { content: JSX.Element }[];
  step?: number;
};

const Stepper = ({ steps, step }: Props) => {
  const [currentStep, setCurrentStep] = useState(step || 0);
  const [isReadyForTransition, setIsReadyForTransition] = useState(true);

  useEffect(() => {
    if (step !== undefined && Number.isInteger(step)) {
      setCurrentStep(step);
    }
  }, [step, setCurrentStep]);

  return (
    <div className="h-full w-full overflow-x-hidden">
      <div className="grid h-full w-full grid-rows-[1fr_auto]">
        {steps.map(({ content }, i) => (
          <Transition
            afterEnter={() => setIsReadyForTransition(true)}
            beforeLeave={() => setIsReadyForTransition(false)}
            afterLeave={() => setIsReadyForTransition(true)}
            appear={true}
            key={i}
            className="h-full w-full"
            show={currentStep === i && isReadyForTransition}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {content}
          </Transition>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
