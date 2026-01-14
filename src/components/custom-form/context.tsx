import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { FieldErrors } from "./FIeldErrors";
import { InputField } from "./InputField";
import { SubmitButton } from "./SubmitButton";
import { FormGlobalError } from "./FormGlobalError";
import { TextAreaField } from "./TextAreaField";
import { RadioButtonField } from "./RadioButtonField";
import { SelectField } from "./SelectField";

export const {
    fieldContext,
    formContext,
    useFieldContext,
    useFormContext
} = createFormHookContexts();

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        FieldErrors,
        InputField,
        TextAreaField,
        RadioButtonField,
        SelectField,
    },
    formComponents: {
        SubmitButton,
        FormGlobalError
    }
});