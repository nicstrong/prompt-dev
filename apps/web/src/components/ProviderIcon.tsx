import { Model } from '@/trpc/types'
import { OpenAI } from './icons/OpenAI'
import Anthropic from './icons/Anthropic'
import Gemini from './icons/Gemini'
import Grok from './icons/Grok'

export function ProviderIcon({ provider }: { provider: Model['provider'] }) {
  switch (provider) {
    case 'openai':
      return <OpenAI className='fill-sky-500' />
    case 'anthropic':
      return <Anthropic className='fill-sky-500' />
    case 'google':
      return <Gemini className='fill-sky-500' />
    case 'grok':
      return <Grok className='fill-sky-500' />
  }
}
