import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { Controller, useForm, type FieldError as FieldErrorState } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ContactInquirySuccess } from '@/features/contact/components/ContactInquirySuccess'
import { InquiryTextField } from '@/features/contact/components/InquiryTextField'
import { consultationTopicValues } from '@/features/contact/data/consultationTopics'
import {
  contactInquirySchema,
  type ContactInquiry,
} from '@/features/contact/schemas/contactInquirySchema'
import { submitContactInquiry } from '@/features/contact/services/submitContactInquiry'
import { localizeFieldError } from '@/lib/forms'
import { useI18n } from '@/i18n/useI18n'
import type { ContactPrefill } from '@/types/contactPrefill'

const emptyContactInquiry: ContactInquiry = {
  fullName: '',
  email: '',
  phone: '',
  consultationTopic: '',
  message: '',
  hasAcceptedPrivacyPolicy: false,
}

type ContactInquiryFormProps = { prefill?: ContactPrefill }

export function ContactInquiryForm({ prefill }: ContactInquiryFormProps) {
  const { form, topics, validation } = useI18n().messages.contact
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInquiry>({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: { ...emptyContactInquiry, ...prefill },
  })

  if (isSubmitSuccessful) return <ContactInquirySuccess />

  const localizeError = (error?: FieldErrorState) => localizeFieldError(error, validation)
  const topicItems = consultationTopicValues.map((value) => ({
    value,
    label: topics[value],
  }))

  return (
    <form noValidate onSubmit={handleSubmit(submitContactInquiry)}>
      <FieldGroup className="gap-4">
        <InquiryTextField
          id="fullName"
          label={form.fullName}
          autoComplete="name"
          placeholder={form.fullNamePlaceholder}
          error={localizeError(errors.fullName)}
          {...register('fullName')}
        />
        <InquiryTextField
          id="email"
          type="email"
          label={form.email}
          autoComplete="email"
          placeholder={form.emailPlaceholder}
          error={localizeError(errors.email)}
          {...register('email')}
        />
        <InquiryTextField
          id="phone"
          type="tel"
          label={form.phone}
          autoComplete="tel"
          placeholder={form.phonePlaceholder}
          error={localizeError(errors.phone)}
          {...register('phone')}
        />

        <Controller
          name="consultationTopic"
          control={control}
          render={({ field }) => (
            <Field data-invalid={Boolean(errors.consultationTopic)}>
              <FieldLabel htmlFor="consultationTopic">
                {form.consultationTopic}
              </FieldLabel>
              <Select
                items={topicItems}
                value={field.value || null}
                onValueChange={(topic) => field.onChange(topic ?? '')}
              >
                <SelectTrigger
                  id="consultationTopic"
                  className="w-full"
                  aria-invalid={Boolean(errors.consultationTopic)}
                  onBlur={field.onBlur}
                >
                  <SelectValue placeholder={form.consultationTopicPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {topicItems.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[localizeError(errors.consultationTopic)]} />
            </Field>
          )}
        />

        <Field data-invalid={Boolean(errors.message)}>
          <FieldLabel htmlFor="message">{form.message}</FieldLabel>
          <Textarea
            id="message"
            rows={3}
            placeholder={form.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            {...register('message')}
          />
          <FieldError errors={[localizeError(errors.message)]} />
        </Field>

        <Controller
          name="hasAcceptedPrivacyPolicy"
          control={control}
          render={({ field }) => (
            <Field data-invalid={Boolean(errors.hasAcceptedPrivacyPolicy)}>
              <Label className="items-start gap-2.5 text-label-sm leading-snug font-normal text-slate-navy">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(errors.hasAcceptedPrivacyPolicy)}
                  className="mt-0.5"
                />
                {form.privacyConsent}
              </Label>
              <FieldError errors={[localizeError(errors.hasAcceptedPrivacyPolicy)]} />
            </Field>
          )}
        />

        <Button type="submit" variant="cta" size="xl" disabled={isSubmitting}>
          {isSubmitting ? form.submitting : form.submit}
          <Send aria-hidden className="size-5" />
        </Button>
      </FieldGroup>
    </form>
  )
}
