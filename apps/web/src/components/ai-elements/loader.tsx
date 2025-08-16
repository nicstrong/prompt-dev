import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type LoaderIconProps = {
  size?: number
}

const LoaderIcon = ({ size = 16 }: LoaderIconProps) => (
  <svg width={size} viewBox='0 0  120 30' style={{ color: 'currentcolor' }}>
    <circle cx='15' cy='15' r={15}>
      <animate
        attributeName='r'
        from='15'
        to='15'
        begin='0s'
        dur='0.8s'
        values='15;9;15'
        calcMode='linear'
        repeatCount='indefinite'
      />
      <animate
        attributeName='fill-opacity'
        from='1'
        to='1'
        begin='0s'
        dur='0.8s'
        values='1;.5;1'
        calcMode='linear'
        repeatCount='indefinite'
      />
    </circle>
    <circle
      cx='60'
      cy='15'
      r={15}
      attributeName='fill-opacity'
      from='1'
      to='0.3'
    >
      <animate
        attributeName='r'
        from='9'
        to='9'
        begin='0s'
        dur='0.8s'
        values='9;15;9'
        calcMode='linear'
        repeatCount='indefinite'
      />
      <animate
        attributeName='fill-opacity'
        from='0.5'
        to='0.5'
        begin='0s'
        dur='0.8s'
        values='.5;1;.5'
        calcMode='linear'
        repeatCount='indefinite'
      />
    </circle>
    <circle cx='105' cy='15' r={15}>
      <animate
        attributeName='r'
        from='15'
        to='15'
        begin='0s'
        dur='0.8s'
        values='15;9;15'
        calcMode='linear'
        repeatCount='indefinite'
      />
      <animate
        attributeName='fill-opacity'
        from='1'
        to='1'
        begin='0s'
        dur='0.8s'
        values='1;.5;1'
        calcMode='linear'
        repeatCount='indefinite'
      />
    </circle>
  </svg>
)

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: number
}

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => (
  <div className={cn('inline-flex items-center', className)} {...props}>
    <LoaderIcon size={size} />
  </div>
)
