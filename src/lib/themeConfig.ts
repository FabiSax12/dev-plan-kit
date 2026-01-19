import type { ProjectStatus, ProjectType } from "@/domain/Project";

export const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
    planning: { label: "Planning", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
    "in_development": { label: "In Development", className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
    completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
    "on_hold": { label: "On Hold", className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300" },
}

export const typeConfig: Record<ProjectType, { label: string; className: string }> = {
    personal: { label: "Personal", className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
    work: { label: "Client Work", className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
}