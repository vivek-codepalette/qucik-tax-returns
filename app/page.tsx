import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Quick Tax Claims"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="font-semibold text-lg">Quick Tax Claims™</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="font-semibold">
            Sign in
          </Button>
          <Image
            src="/gb-flag.svg"
            alt="GB Flag"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-8 py-12">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Claim Your PPI Tax Refund Today!
            </h1>
            <p className="text-lg text-muted-foreground">
              Now you can claim a tax refund in 60 seconds...
              <span className="italic">Guaranteed!</span> - simply click the button below to get started!
            </p>
            <div className="space-y-4">
              <Link
                href="/claim"
                className="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white h-12 text-lg rounded-md"
              >
                Start now
                <ArrowRight className="ml-2" />
              </Link>
              <p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
                <span>⏱ It only takes a minute!</span>
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Image
                  src="/lock-icon.svg"
                  alt="Security"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span>This form is encrypted to ensure your data is safe</span>
              </div>
              <Image
                src="/lets-encrypt.svg"
                alt="Let's Encrypt"
                width={100}
                height={30}
                className="h-8 w-auto"
              />
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <Image
              src="/hero-image.jpg"
              alt="Happy customer"
              width={500}
              height={600}
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-2xl font-semibold text-center mb-12">
              PPI tax refunds has featured on
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              <Image src="/itv-logo.svg" alt="ITV" width={120} height={60} className="opacity-75" />
              <Image src="/daily-mail-logo.svg" alt="Daily Mail" width={120} height={60} className="opacity-75" />
              <Image src="/mirror-logo.svg" alt="Mirror" width={120} height={60} className="opacity-75" />
              <Image src="/bbc-logo.svg" alt="BBC" width={120} height={60} className="opacity-75" />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 container">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Why can I claim a tax refund on my PPI payout?</AccordionTrigger>
                <AccordionContent>
                  You can claim a tax refund on your PPI payout because the interest paid on the compensation by the lender is subject to income tax. As a result, you are entitled to a tax refund on the interest paid, which is calculated based on the statutory interest rate set by HMRC.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I claim my tax refund on my PPI payout?</AccordionTrigger>
                <AccordionContent>
                  The process is simple and can be completed through our online platform.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Who is eligible to claim a tax refund on their PPI payout?</AccordionTrigger>
                <AccordionContent>
                  Most people who received a PPI payout are eligible to claim a tax refund.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How much money could I be entitled to?</AccordionTrigger>
                <AccordionContent>
                  The amount varies depending on your PPI payout and circumstances.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is the process of claiming a tax refund complicated?</AccordionTrigger>
                <AccordionContent>
                  No, we&apos;ve made the process simple and straightforward.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t">
        <div className="container space-y-8">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Quick Tax Claims"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-semibold text-lg">Quick Tax Claims™</span>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground space-y-4">
            <p>
              Quick Tax Claims Limited | Company Number: 14377745 | Address: International House,
              <br />
              61 Mosley Street, Manchester, M2 3HZ | info@quicktaxclaims.co.uk
            </p>
            <p>
              Quick Tax Claims Limited provides services in line with its Terms of Engagement and
              <br />
              Privacy Policy
            </p>
            <p>© 2023 Quick Tax Claims Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

