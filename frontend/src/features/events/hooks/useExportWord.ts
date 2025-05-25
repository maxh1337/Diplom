import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BACKEND_MAIN } from "../../../lib/constants/urls";
import eventService from "../../../lib/modules/events/event.service";

export function useExportWord() {
  const { mutate: exportDocx, isPending: isWordExportLoading } = useMutation({
    mutationKey: ["export event docx"],
    mutationFn: async (id: string) => {
      const { path: filePath } = await eventService.exportEventToDocx(id);
      return { id, filePath };
    },
    onSuccess: ({ id, filePath }: { id: string; filePath: string }) => {
      const downloadUrl = `${BACKEND_MAIN}/${filePath}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `event-${id}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Документ успешно скачан");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`Ошибка при скачивании документа: ${error.message}`);
      }
    },
  });

  return { exportDocx, isWordExportLoading };
}
