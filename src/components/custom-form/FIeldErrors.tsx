import { AnyFieldMeta } from "@tanstack/react-form"

interface FieldErrorProps {
    meta: AnyFieldMeta
}

export const FieldErrors = ({ meta }: FieldErrorProps) => {
    if (meta.isValid) return null;
    if (!meta.errors?.length) return null;
    if (!meta.isTouched) return null;

    return meta.errors.map((error, index) => (
        <p key={index} className="text-destructive text-xs font-medium">
            {error.message}
        </p>
    ))
}