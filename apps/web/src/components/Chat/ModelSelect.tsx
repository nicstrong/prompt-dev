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

export function ModelSelect(props: SelectProps) {
  const { data: models } = useQuery(trpc.models.getModels.queryOptions())

  return (
    <Select {...props}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {models?.map((model) => (
          <SelectItem key={model.modelId} value={model.modelId}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
