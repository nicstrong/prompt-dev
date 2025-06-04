import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { xai } from '@ai-sdk/xai'
import { google } from '@ai-sdk/google'
import { LanguageModel } from 'ai'
import { LRUCache } from 'lru-cache'
import { scopedLog } from 'scope-log'
import { getModelById, Model } from '~/db/models.js'

const cache = new LRUCache<string, Model>({
  max: 500,
  ttl: 1000 * 60 * 20,
  fetchMethod: async (key, staleValue, { options, signal }) => {
    // You can use the signal to abort the fetch if needed
    return (await getModelById(key)) ?? undefined
  },
})

const log = scopedLog('modelFactory')
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini'

export async function createModel(
  modelId: string | null,
): Promise<LanguageModel> {
  if (modelId === null) {
    log.warn('No modelId specified, using default model')
    return openai(DEFAULT_OPENAI_MODEL)
  }

  const model = await cache.fetch(modelId)

  if (!model) {
    log.warn(`Model with ID ${modelId} not found, using default model`)
    return openai(DEFAULT_OPENAI_MODEL)
  }

  switch (model.provider) {
    case 'openai':
      return openai(model.modelId)
    case 'anthropic':
      return anthropic(model.modelId)
    case 'google':
      return google(model.modelId)
    case 'grok':
      return xai(model.modelId)
  }

  log.warn(`Provider ${model.provider} not supported, using default model`)
  return openai(DEFAULT_OPENAI_MODEL)
}
