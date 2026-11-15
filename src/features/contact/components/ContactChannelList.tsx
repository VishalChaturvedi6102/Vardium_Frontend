import { Card, CardContent } from '@/components/ui/card'
import { contactChannels } from '@/features/contact/data/contactChannels'
import { useI18n } from '@/i18n/useI18n'

const channelClassName = 'flex items-center gap-3 text-navy'

export function ContactChannelList() {
  const { channels } = useI18n().messages.contact

  return (
    <Card className="self-start shadow-none [--card-spacing:--spacing(5)] lg:[--card-spacing:--spacing(8)]">
      <CardContent>
        <ul className="flex flex-col gap-5">
          {contactChannels.map(({ id, icon: ChannelIcon, value, href }) => {
            const channelContent = (
              <>
                <ChannelIcon aria-hidden className="size-5 shrink-0 text-brand" />
                <span className="min-w-0">
                  <span className="block text-label-sm text-caption normal-case">
                    {channels[id]}
                  </span>
                  <span className="block truncate text-label-md font-bold">{value}</span>
                </span>
              </>
            )

            return (
              <li key={id}>
                {href ? (
                  <a href={href} className={channelClassName}>
                    {channelContent}
                  </a>
                ) : (
                  <div className={channelClassName}>{channelContent}</div>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
