import UploadHeader from '@/components/upload/upload-header';
import UploadForm from '@/components/upload/UploadForm';
import BgGradient from '@/components/common/BgGradient';
import { currentUser} from '@clerk/nextjs/server';
import { hasReachedUploadLimit } from "@/lib/user";
import { redirect } from 'next/navigation';

export default async function Upload() {
    const user=await currentUser();
    const userId=user?.id;
    if(!userId) redirect('/sign-in');
    const {hasReachedLimit,uploadLimit}= await hasReachedUploadLimit(user);
    if(hasReachedLimit){
        redirect('/dashboard');
    }
    return (
        <section className="min-h-screen">
            <BgGradient />
            <div className="mx-auto max-w-7xl px-6 py-24
            sm:py-32 lg:px-8">
                <div className="flex flex-col items-center
                    justify-center gap-6 text-center">
                    <UploadHeader />
                    <UploadForm />
                </div>
            </div>
        </section>
    );
}