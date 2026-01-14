import { useStore } from "@tanstack/react-form";
import { Button } from "../ui/button"
import { Field } from "../ui/field"
import { useFormContext } from "./context"
import React from "react";

export const SubmitButton = (props: React.ComponentProps<"button">) => {
    const form = useFormContext();

    const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
        state.isSubmitting,
        state.canSubmit,
    ]);

    return <Field>
        <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            form={form.formId}
            {...props}
        >
            {props.children}
        </Button>
    </Field>
}