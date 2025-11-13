import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UpgradeRequired from '@/components/home/UpgradeRequired'
import {HasActiveSub} from '@/lib/user'
export default async function Layout ({
children,
}: {
children: React.ReactNode;
}){
    const user = await currentUser() ;

    if (!user) {
        redirect('/sign-in');}

    const hasActiveSubscription = await HasActiveSub(user);

    if (!hasActiveSubscription) {
    return <UpgradeRequired />;}

    return <>{children}</>;}