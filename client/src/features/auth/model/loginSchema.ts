import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email('Некорректный формат email'),
    password: z.string().min(1, 'Пароль обязателен для заполнения'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
