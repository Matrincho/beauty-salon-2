'use client'

import { useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

function FaqItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-t border-[#E5E0D8] last:border-b">
      <button
        onClick={onToggle}
        className="w-full grid grid-cols-[2.5rem_1fr_1.5rem] items-start gap-6 py-7 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-sans text-xs text-[#8C8074]/60 pt-1 tabular-nums tracking-widest">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={[
            'font-serif text-base md:text-lg leading-snug text-pretty transition-colors duration-200',
            isOpen ? 'text-[#D4AF37]' : 'text-[#1A1A1B] group-hover:text-[#D4AF37]',
          ].join(' ')}
        >
          {question}
        </span>
        <span className="relative mt-1.5 w-3.5 h-3.5 shrink-0 flex items-center justify-center" aria-hidden="true">
          <span className="absolute block w-3.5 h-px bg-[#D4AF37]" />
          <span
            className={[
              'absolute block w-px h-3.5 bg-[#D4AF37] transition-transform duration-300',
              isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
            ].join(' ')}
          />
        </span>
      </button>

      <div
        className={[
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <p className="font-sans text-sm md:text-base leading-relaxed text-[#8C8074] pl-[calc(2.5rem+1.5rem)] pb-8 pr-10">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { locale } = useLanguage()

  const faqs = [
    { question: t(tr.faq.q1, locale), answer: t(tr.faq.a1, locale) },
    { question: t(tr.faq.q2, locale), answer: t(tr.faq.a2, locale) },
    { question: t(tr.faq.q3, locale), answer: t(tr.faq.a3, locale) },
    { question: t(tr.faq.q4, locale), answer: t(tr.faq.a4, locale) },
    { question: t(tr.faq.q5, locale), answer: t(tr.faq.a5, locale) },
    { question: t(tr.faq.q6, locale), answer: t(tr.faq.a6, locale) },
  ]

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section
      id="faq"
      className="pt-12 md:pt-16 pb-24 md:pb-32 bg-[#F9F8F6] scroll-mt-16 md:scroll-mt-20"
      aria-label={t(tr.faq.label, locale)}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="flex flex-col gap-5 mb-16 animate-fade-in-up">
          <SectionLabel text={t(tr.faq.label, locale)} />
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-[#1A1A1B] leading-tight text-balance">
            {t(tr.faq.heading, locale)}{' '}
            <br />
            <span className="italic text-[#8C8074]">{t(tr.faq.headingItalic, locale)}</span>
          </h2>
        </div>

        <div className="animate-fade-in-up delay-200">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              index={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
