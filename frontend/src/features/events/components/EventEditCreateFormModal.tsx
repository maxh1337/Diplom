"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { default as Image } from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BACKEND_MAIN } from "../../../lib/constants/urls";
import eventService from "../../../lib/modules/events/event.service";
import { IEvent } from "../../../lib/modules/events/event.types";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  edit?: boolean;
  initialEvent?: IEvent;
  onSuccess?: (event: IEvent) => void;
}

export default function EventFormModal({
  isOpen,
  onClose,
  edit = false,
  initialEvent,
  onSuccess,
}: EventFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [hashTags, setHashTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (edit && initialEvent) {
      setTitle(initialEvent.title || ""); // Устанавливаем пустую строку, если title отсутствует
      setDescription(initialEvent.description || "");
      setHashTags(initialEvent.hashTags || []);
      setEventDate(initialEvent.eventDate.toString().split("T")[0]);
      setEventTime(initialEvent.eventTime);
      setFile(null);
    }
  }, [edit, initialEvent]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setHashTags((prev) => Array.from(new Set([...prev, tagInput.trim()])));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setHashTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate || !eventTime) return;
    setSubmitting(true);
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    hashTags.forEach((tag) => form.append("hashTags", tag));
    form.append("eventDate", eventDate);
    form.append("eventTime", eventTime);
    if (file) form.append("image", file);

    try {
      const { data } =
        edit && initialEvent
          ? await eventService.updateEvent(initialEvent.id, form)
          : await eventService.createEvent(form);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-xl p-6">
        <Dialog.Title className="text-xl font-brain text-white mb-4">
          {edit ? "Редактировать событие" : "Добавить событие"}
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Фото события */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-brain">Фото:</label>
            <div className="relative w-full h-48 rounded-md bg-third overflow-hidden">
              {file ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : edit && initialEvent?.image?.path ? (
                <Image
                  src={`${BACKEND_MAIN}/${initialEvent.image.path}`}
                  alt="Event Image"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Нет изображения
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="file-input"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-brain hover:bg-blue-700 cursor-pointer transition-colors mt-2"
              >
                Выбрать файл
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Скрываем стандартный input
              />
              <span className="text-white font-brain">
                {file ? file.name : "Файл не выбран"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={5}
              maxLength={50}
              className="w-full p-2 rounded-md bg-third text-white font-brain"
              required
            />
            <span className="text-xs text-gray-400 font-brain ml-1">
              {title.length}/50 символов
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <textarea
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minLength={20}
              maxLength={200}
              className="w-full p-2 rounded-md bg-third text-white font-brain h-24"
            />
            <span className="text-xs text-gray-400 font-brain ml-1">
              {description.length}/200 символов
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Добавить тег"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 rounded-md bg-third text-white font-brain"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-fourth rounded-md text-white"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-fourth text-white rounded-full font-brain flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-sm"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="p-2 rounded-md bg-third text-white font-brain"
              required
            />
            <input
              type="text"
              placeholder="HH:MM-HH:MM"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="p-2 rounded-md bg-third text-white font-brain"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-third rounded-md text-white font-brain"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 rounded-md text-white font-brain disabled:opacity-50"
            >
              {edit ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
