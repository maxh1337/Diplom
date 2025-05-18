import { twMerge } from "tailwind-merge";

interface Hash {
  hashTag: string;
}

export default function EventHashtag({ hashTag }: Hash) {
  return (
    <div
      className={twMerge(
        "font-brain text-white py-1 px-2 bg-gray-700 rounded-xl text-sm"
      )}
    >
      {hashTag}
    </div>
  );
}
