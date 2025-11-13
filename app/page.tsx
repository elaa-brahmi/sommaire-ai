//import Image from "next/image";
import HeroSection from '@/components/home/HeroSection'
import DemoSection from '@/components/home/DemoSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import Pricing from '../components/home/Pricing'
import CTA from '../components/home/CTA'




import BgGradient from '@/components/common/BgGradient'
export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient/>
      <div className="flex flex-col">
        <HeroSection/>
        <DemoSection/>
        <HowItWorksSection/>
        <Pricing/>
        <CTA/>
      </div>
   
     
    </div>
  );
}
