import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Registers our custom `text-*` font-size tokens so they are not mistaken for text colours.
const mergeClassNames = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'display-mobile',
            'headline-lg',
            'headline-lg-mobile',
            'headline-md',
            'headline-sm',
            'body-lg',
            'body-md',
            'body-sm',
            'label-lg',
            'label-md',
            'label-sm',
          ],
        },
      ],
    },
  },
})

export function cn(...classNames: ClassValue[]): string {
  return mergeClassNames(clsx(classNames))
}
