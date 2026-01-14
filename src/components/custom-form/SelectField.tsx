import { Field, FieldLabel } from "../ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useFieldContext } from "./context"

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    placeholder?: string
    options: { value: string; label: string }[]
}

export const SelectField = ({ label, placeholder, options }: SelectFieldProps) => {
    const field = useFieldContext<string>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <Select
                name={field.name}
                defaultValue={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                aria-invalid={isInvalid}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    )
}