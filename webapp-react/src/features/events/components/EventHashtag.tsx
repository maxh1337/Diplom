import { twMerge } from "tailwind-merge";

interface Hash {
  hashTag: string;
}

export default function EventHashtag({ hashTag }: Hash) {
  return (
    <div
      className={twMerge(
        "font-brain text-white py-1 px-2.5 bg-third rounded-xl text-sm whitespace-nowrap shrink-0"
      )}
    >
      {hashTag}
    </div>
  );
}
