import { Loader2 } from 'lucide-react';

const Loader = () => (
  <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-center items-center gap-4">
    <Loader2 className="animate-spin" size={48} />
  </div>
);

export default Loader;
