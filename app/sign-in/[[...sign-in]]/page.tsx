import { SignIn } from '@clerk/nextjs'
import BgGradient from '@/components/common/BgGradient'

export default function Page() {
  return (
    <section className="flex items-center justify-center w-full mx-auto
    lg:min-h-[30vh]">
         <div className="py-12 lg:py-24 max-w-5xl mx-auto sm:px-6
        lg:px-8 lg:pt-12">
            <BgGradient className="from-rose-400 via-rose-300 to-orange-200"/>
        <SignIn />
        </div>
  </section>)
}