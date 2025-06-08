import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { xai } from '@ai-sdk/xai'
import { LRUCache } from 'lru-cache'
import { scopedLog } from 'scope-log'
import { getModelById, Model } from '~/db/models.js'

const cache = new LRUCache<string, Model>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
  fetchMethod: async (key, staleValue, { options, signal }) => {
    const model = await getModelById(key)
    return model ?? undefined
  },
})

const log = scopedLog('modelFactory')
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini'

export async function createModel(model: string | null) {
  if (model === null) {
    log.warn('No model specified, using default model')
    return openai(DEFAULT_OPENAI_MODEL)
  }

  const modelDef = await cache.fetch(model)

  switch (modelDef?.provider) {
    case 'openai':
      return openai(modelDef.modelId)
    case 'anthropic':
      return anthropic(modelDef.modelId)
    case 'google':
      return google(modelDef.modelId)
    case 'grok':
      return xai(modelDef.modelId)
    default:
      log.warn(
        `Unknown model provider: ${modelDef?.provider}, using default model`,
      )
      return openai(DEFAULT_OPENAI_MODEL)
  }
}
