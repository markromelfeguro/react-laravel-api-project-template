import MainLayout from "../../../components/layouts/MainLayout";
import { SkeletonBox } from "../../../components/ui";

const MyProfileSkeleton = () => {
  const content = (
    <div className="space-y-12 pb-20">
      {/* Header Skeleton */}
      <header className="flex items-center gap-4">
        <SkeletonBox width="w-20" height="h-20" rounded="rounded-3xl" />
        <div className="space-y-2">
          <SkeletonBox width="w-64" height="h-10" />
          <SkeletonBox width="w-96" height="h-4" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Visuals */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-surface/50 p-8 rounded-[3rem] border border-border/50 space-y-8">
            <SkeletonBox width="w-24" height="h-3" />
            <div className="space-y-4">
               {/* FileUpload Placeholder */}
               <SkeletonBox width="w-full" height="h-48" rounded="rounded-[2.5rem]" />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Form & Danger Zone */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-surface/50 p-10 rounded-[3.5rem] border border-border/50 space-y-10">
            <SkeletonBox width="w-32" height="h-3" />
            
            {/* Input Grid Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <SkeletonBox width="w-20" height="h-3" className="ml-1" />
                <SkeletonBox width="w-full" height="h-14" rounded="rounded-2xl" />
              </div>
              <div className="space-y-2">
                <SkeletonBox width="w-28" height="h-3" className="ml-1" />
                <SkeletonBox width="w-full" height="h-14" rounded="rounded-2xl" />
              </div>
            </div>

            {/* Textarea Placeholder */}
            <div className="space-y-2">
               <SkeletonBox width="w-32" height="h-3" className="ml-1" />
               <SkeletonBox width="w-full" height="h-32" rounded="rounded-2xl" />
            </div>

            {/* Button Placeholder */}
            <div className="flex justify-end pt-4">
              <SkeletonBox width="w-48" height="h-14" rounded="rounded-2xl" />
            </div>
          </section>

          {/* Danger Zone Placeholder */}
          <section className="bg-surface/20 p-10 rounded-[3.5rem] border border-red-500/10 space-y-6">
            <div className="flex items-center gap-3">
              <SkeletonBox width="w-8" height="h-8" rounded="rounded-lg" />
              <SkeletonBox width="w-40" height="h-6" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2 flex-1">
                <SkeletonBox width="w-48" height="h-4" />
                <SkeletonBox width="w-full" height="h-3" />
              </div>
              <SkeletonBox width="w-40" height="h-12" rounded="rounded-xl" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return <MainLayout content={content} />;
};

export default MyProfileSkeleton;