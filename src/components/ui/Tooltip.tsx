'use client';

import { Tooltip as ReactTooltip } from 'react-tooltip';

type Props = {
  id: string;
  content: string;
  children: JSX.Element;
  placement?: 'top' | 'bottom';
};
export default function Tooltip({ id, content, placement = 'top', children }: Props) {
  return (
    <div data-tooltip-id={id} data-tooltip-content={content} data-tooltip-place={placement}>
      {children}
      <ReactTooltip id={id} />
    </div>
  );
}
