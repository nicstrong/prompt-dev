import { useQuery } from '@tanstack/react-query'
import { trpc } from '../../trpc/trpc'
import { Button } from '../ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import * as O from 'fp-ts/Option'
import { Model } from '@/trpc/types'
import { useState } from 'react'
import { EditModelDialog } from './EditModelDialog'
import { ProviderIcon } from '../ProviderIcon'

export function ManageModels() {
  const { data: models } = useQuery(trpc.models.getModels.queryOptions())
  const [showEditUpdateModel, setShowEditUpdateModel] = useState<
    O.Option<Model | null>
  >(O.none)

  return (
    <div className='w-full overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Provider</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.shortDescription}</TableCell>
              <TableCell className=''>
                <div className='flex items-center gap-2'>
                  <ProviderIcon provider={model.provider} />
                  {model.provider === 'openai'
                    ? 'OpenAI'
                    : model.provider === 'anthropic'
                      ? 'Anthropic'
                      : model.provider === 'google'
                        ? 'Google'
                        : 'Grok'}
                </div>
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='mr-2'
                  title='Edit model'
                  onClick={() => setShowEditUpdateModel(O.some(model))}
                >
                  <Pencil size={16} />
                </Button>
                <Button variant='ghost' size='icon' title='Delete model'>
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {O.isSome(showEditUpdateModel) && (
        <EditModelDialog
          model={showEditUpdateModel.value}
          onConfirm={() => {
            // Handle model update logic here
            setShowEditUpdateModel(O.none)
          }}
          onDismiss={() => setShowEditUpdateModel(O.none)}
        />
      )}
    </div>
  )
}
