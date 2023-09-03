import { IconLoader2 } from '@tabler/icons-react';

const Loading = () => {
  return (
    <div className="layout-container flex flex-1 items-center justify-center">
      <IconLoader2 className="animate-spin" />
    </div>
  );
};

export default Loading;
