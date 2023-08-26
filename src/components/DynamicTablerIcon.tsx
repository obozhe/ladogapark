import * as icons from '@tabler/icons-react';
import { TablerIconsProps } from '@tabler/icons-react';
import { Icon123 } from '@tabler/icons-react';
import React from 'react';

type Props = {
  icon: string;
} & TablerIconsProps;

export default function DynamicTablerIcon({ icon, ...props }: Props) {
  const IconComponent = (icons as unknown as Record<string, (props: TablerIconsProps) => JSX.Element>)[icon];

  return IconComponent ? <IconComponent {...props} /> : <Icon123 {...props} />;
}
