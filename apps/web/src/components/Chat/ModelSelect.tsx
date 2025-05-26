import { useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { trpc } from '@/trpc/trpc'
import { SelectProps } from '@radix-ui/react-select'
import { InfoIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { ProviderIcon } from '../ProviderIcon'

export function ModelSelect(props: SelectProps) {
  const { data: models } = useQuery(trpc.models.getModels.queryOptions())

  return (
    <Select {...props}>
      <SelectTrigger className='bg-input-background dark:bg-input-background w-[180px] border-0 backdrop-blur-xl focus-visible:border-0 focus-visible:ring-0'>
        <SelectValue asChild>
          <span>{props.value}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className='bg-sidebar dark:bg-sidebar-accent border-0 focus-visible:border-0 focus-visible:ring-0'>
        {models?.map((model) => (
          <SelectItem
            key={model.modelId}
            value={model.modelId}
            className='flex items-center'
          >
            <ProviderIcon provider={model.provider} />
            <span>{model.name}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className='size-3 stroke-sky-500' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{model.shortDescription}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
