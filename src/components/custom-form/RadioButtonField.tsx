import { RadioGroupProps } from "@radix-ui/react-radio-group"
import { Field, FieldLabel } from "../ui/field"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useFieldContext } from "./context"
import { Label } from "../ui/label"

interface RadioButtonFieldProps extends RadioGroupProps {
    label?: string
    options: {
        value: string
        label: string
    }[]
}

export const RadioButtonField = ({ label, options, ...props }: RadioButtonFieldProps) => {
    const field = useFieldContext<string | undefined>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <RadioGroup
                id={field.name}
                name={field.name}
                aria-invalid={isInvalid}
                className="flex gap-4"
                defaultValue={field.state.value}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
                {...props}
            >
                {options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-normal cursor-pointer">
                            {option.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </Field>
    )
}

