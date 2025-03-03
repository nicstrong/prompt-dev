import baseConfig from '@prompt-dev/prettier-config'
import 'prettier-plugin-tailwindcss'

const config = {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
