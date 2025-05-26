import {
  SelectContent,
  SelectItem,
  SelectProps,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select'
import { Select } from '../ui/select'
import { ProviderIcon } from '../ProviderIcon'
import { Model } from '@/trpc/types'

const providers: { id: Model['provider']; name: string }[] = [
  {
    id: 'openai',
    name: 'OpenAI',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
  },
  {
    id: 'google',
    name: 'Google',
  },
  {
    id: 'grok',
    name: 'Grok',
  },
]

export function ProviderSelect(props: SelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue>
          <span>{props.value}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {providers?.map((provider) => (
          <SelectItem
            key={provider.id}
            value={provider.id}
            className='flex items-center gap-4'
          >
            <ProviderIcon provider={provider.id} />
            <span>{provider.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
