import { useStore } from "@tanstack/react-form";
import { useFormContext } from "./context"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface FormGlobalErrorProps {
    alertTitle?: string;

}

export const FormGlobalError = ({ alertTitle }: FormGlobalErrorProps) => {
    const form = useFormContext();

    const [errors] = useStore(form.store, (state) => ([
        state.errors,
    ]))

    if (errors.length === 0) return null;


    return (
        <Alert variant="destructive" className="mb-4" hidden={errors.length === 0}>
            <AlertCircleIcon />
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>
                {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                ))}
            </AlertDescription>
        </Alert>
    )
}