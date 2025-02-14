'use client';

import { useState } from 'react';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface MultiSelectProps {
  options: { id: string; name: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items'
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full'>
          {selected.length > 0
            ? selected
                .map((id) => options.find((opt) => opt.id === id)?.name)
                .join(', ')
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full'>
        <Command>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => toggleSelect(option.id)}
                className='flex justify-between'
              >
                {option.name}
                {selected.includes(option.id) && (
                  <Check className='h-4 w-4 text-blue-500' />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
