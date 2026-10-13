import { z } from 'zod';

export const registerSchema = z
    .object({
        email: z.string().email('Некорректный формат email'),
        password: z.string(),
        confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Пароль должен быть не менее 8 символов.');
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Пароль должен содержать хотя бы одну строчную букву ('a'-'z').");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Пароль должен содержать хотя бы одну заглавную букву ('A'-'Z').");
        }

        if (errors.length > 0) {
            ctx.addIssue({
                code: 'custom',
                message: errors.join('\n'),
                path: ['password'],
            });
        }

        if (password !== confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'Пароли не совпадают',
                path: ['confirmPassword'],
            });
        }
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
