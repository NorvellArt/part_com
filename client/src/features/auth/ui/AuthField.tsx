'use client';

import { useState } from 'react';
import { Control, Controller, Path } from 'react-hook-form';
import { Field, FieldLabel, FieldError, Input } from '@/shared/components';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFieldProps<T extends Record<string, any>> {
    name: Path<T>;
    label: string;
    control: Control<T>;
    type?: 'email' | 'password';
    placeholder?: string;
    autoComplete?: string;
    disabled?: boolean;
}

export function AuthField<T extends Record<string, any>>({
    name,
    label,
    control,
    type = 'password',
    placeholder,
    autoComplete,
    disabled,
}: AuthFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const currentType = isPasswordType && showPassword ? 'text' : type;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const errorMessages =
                    fieldState.error?.message?.split('\n') || [];

                return (
                    <Field
                        data-invalid={fieldState.invalid}
                        className="flex flex-col gap-1.5"
                    >
                        <FieldLabel
                            htmlFor={`auth-${name}`}
                            className="text-xs font-medium text-foreground/90"
                        >
                            {label}
                        </FieldLabel>
                        <div className="relative w-full">
                            <Input
                                {...field}
                                id={`auth-${name}`}
                                type={currentType}
                                aria-invalid={fieldState.invalid}
                                placeholder={placeholder}
                                autoComplete={autoComplete}
                                disabled={disabled}
                                className={`h-9 rounded-lg border-input bg-background text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring ${
                                    isPasswordType ? 'pr-10' : 'px-3'
                                }`}
                            />
                            {isPasswordType && (
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>

                        {fieldState.invalid && errorMessages.length > 0 && (
                            <div className="flex flex-col gap-0.5 mt-0.5">
                                {errorMessages.map((msg, index) => (
                                    <FieldError
                                        key={index}
                                        className="text-[11px] font-medium text-destructive leading-tight"
                                    >
                                        {msg}
                                    </FieldError>
                                ))}
                            </div>
                        )}
                    </Field>
                );
            }}
        />
    );
}
