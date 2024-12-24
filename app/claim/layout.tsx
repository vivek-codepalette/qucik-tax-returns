import Image from 'next/image'
import Link from 'next/link'

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Quick Tax Claims"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-semibold text-lg">Quick Tax Claims™</span>
          </Link>
          <div className="flex items-center gap-4">
            <Image
              src="/avatar.jpg"
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="border-t py-4 mt-auto">
        <div className="container flex justify-between text-sm text-gray-600">
          <p>© 2023 Quick Tax Claims Limited. All Rights Reserved.</p>
          <div className="space-x-4">
            <Link href="/terms" className="hover:underline">
              Terms of Engagement
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

