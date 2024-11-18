import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200">
          <Link className="flex items-center justify-center" href="#">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ml-2 text-2xl font-bold text-gray-900">EV Charge</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#">
              Features
            </Link>
            <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#">
              Pricing
            </Link>
            <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#">
              About
            </Link>
            <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                    Charge Your EV with Ease
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                    Find and use EV charging stations near you. Fast, convenient, and always available.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                    href="#"
                  >
                    Get Started
                  </Link>
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                    href="#"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4 text-gray-800 dark:text-white">Our Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center justify-center">
              <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <svg className="h-6 w-6 text-gray-800 dark:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Find Stations</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Locate charging stations near you with ease</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <svg className="h-6 w-6 text-gray-800 dark:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Real-time Availability</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Check station availability in real-time</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <svg className="h-6 w-6 text-gray-800 dark:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Easy Payment</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Pay for your charging session with a tap</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800">
                <svg className="h-6 w-6 text-gray-800 dark:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Fast Charging</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Access high-speed charging options</p>
              </div>
            </div>
          </div>
        </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Start Charging Today</h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                    Join thousands of EV owners who are already enjoying the convenience of our charging network.
                  </p>
                </div>
                {/* Subscription Form */}
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-gray-900"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-900 text-white h-10 px-4 py-2 hover:bg-gray-800">
                      Subscribe
                    </button>
                  </form>
                  <p className="text-xs text-gray-600">
                    Get notified about new features and updates.{" "}
                    <Link className="underline text-gray-900" href="#">
                      Terms & Conditions
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="py-6 w-full flex justify-center border-t border-gray-200">
          <p className="text-sm text-gray-600">© 2024 EV Charge. All rights reserved.</p>
        </footer>
      </div>
    );
  }
  