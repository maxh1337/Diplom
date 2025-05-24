export default function EventItemSkeleton() {
  return (
    <tr className="border-t border-white/20 font-brain text-sm animate-pulse">
      <td className="py-2">
        <div className="h-5 w-32 bg-gray-700 rounded" />
      </td>
      <td className="py-2">
        <div className="h-5 w-24 bg-gray-700 rounded" />
      </td>
      <td className="py-2">
        <div className="h-5 w-20 bg-gray-700 rounded" />
      </td>
      <td className="py-2">
        <div className="h-5 w-16 bg-gray-700 rounded" />
      </td>
      <td className="py-2">
        <div className="h-5 w-16 bg-gray-700 rounded" />
      </td>
      <td className="py-2">
        <div className="h-5 w-12 bg-gray-700 rounded" />
      </td>
    </tr>
  );
}
