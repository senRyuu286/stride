import { useCallback, useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useTaskStore } from "../store/useTaskStore";

const formatToLocalDatetime = (d: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const DEFAULT_TAGS = [
  "Work",
  "Personal",
  "Urgent",
  "Study",
  "Exam",
  "Errands",
  "Project",
];

export function useNewTaskMeta(tagsInput: string, setTagsInput: (v: string) => void) {
  const upcomingTasks = useTaskStore((state) => state.upcomingTasks);
  const dailyTasks = useTaskStore((state) => state.dailyTasks);

  const allTasks = useMemo(() => {
    return [
      ...upcomingTasks,
      ...dailyTasks.filter((t): t is NonNullable<typeof t> => t !== null),
    ];
  }, [upcomingTasks, dailyTasks]);

  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  const selectedTagsList = useMemo(() => {
    if (!tagsInput || typeof tagsInput !== "string") return [];
    return tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
  }, [tagsInput]);

  const availableTags = useMemo(() => {
    const existing = allTasks.flatMap((t) => t.tags || []);
    return Array.from(new Set([...DEFAULT_TAGS, ...existing, ...customTags])).filter(Boolean);
  }, [allTasks, customTags]);

  const toggleTag = useCallback((tag: string) => {
    if (selectedTagsList.includes(tag)) {
      setTagsInput(selectedTagsList.filter((t) => t !== tag).join(", "));
    } else {
      setTagsInput([...selectedTagsList, tag].join(", "));
    }
  }, [selectedTagsList, setTagsInput]);

  const addCustomTag = useCallback((e: MouseEvent | KeyboardEvent) => {
    e.preventDefault();
    const t = newTagInput.trim();
    if (!t) return;

    if (!customTags.includes(t)) {
      setCustomTags((prev) => [...prev, t]);
    }
    if (!selectedTagsList.includes(t)) {
      setTagsInput([...selectedTagsList, t].join(", "));
    }

    setNewTagInput("");
  }, [newTagInput, customTags, selectedTagsList, setTagsInput]);

  const quickDates = useMemo(() => {
    const now = new Date();

    const today = new Date(now);
    today.setHours(23, 59, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);

    const thisWeek = new Date(now);
    thisWeek.setDate(now.getDate() + (7 - now.getDay()));
    thisWeek.setHours(23, 59, 0, 0);

    const nextWeek = new Date(thisWeek);
    nextWeek.setDate(thisWeek.getDate() + 7);
    nextWeek.setHours(23, 59, 0, 0);

    return [
      { label: "Today", value: formatToLocalDatetime(today) },
      { label: "Tomorrow", value: formatToLocalDatetime(tomorrow) },
      { label: "This Week", value: formatToLocalDatetime(thisWeek) },
      { label: "Next Week", value: formatToLocalDatetime(nextWeek) },
    ];
  }, []);

  return {
    newTagInput,
    setNewTagInput,
    selectedTagsList,
    availableTags,
    toggleTag,
    addCustomTag,
    quickDates,
  };
}