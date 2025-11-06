import React from 'react'
import { Button } from '../ui/button';
import { Params } from '@/types';
import { cn } from '@/lib/utils';
import { cleared } from '@/constants';


interface ClearButtonProps {
  setLocal?: React.Dispatch<React.SetStateAction<Params>>;
  setParams?: (value: React.SetStateAction<Params>) => void;
  onChange: (patch: Params) => void;
  className?: string;
}

const ClearButton: React.FC<ClearButtonProps> = ({
  setLocal,
  setParams,
  onChange,
  className
}) => {
  const handleClear = () => {

    setLocal?.(cleared);
    setParams?.(cleared);
    onChange({ _reset: true, _apply: true });
    console.log("cleared", cleared);
  };

  return (
    <Button
      className={cn("w-full hover:bg-white",className)}
      variant="outline"
      onClick={handleClear}
    >
      Clear Filter
    </Button>
  );
};
export default ClearButton