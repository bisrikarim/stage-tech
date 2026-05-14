export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-20" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-14" />
      </div>
      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-28" />
      <div className="flex gap-1">
        <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-md w-14" />
        <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-md w-16" />
        <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-md w-12" />
      </div>
      <div className="flex justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-20" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16" />
      </div>
    </div>
  );
}
