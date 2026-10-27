import * as z from 'zod';

export const categorySchema = z.object({
    name: z
        .string()
        .min(1, 'Название обязательно для заполнения')
        .max(100, 'Название слишком длинное'),
    slug: z
        .string()
        .min(1, 'Slug обязателен для заполнения')
        .regex(
            /^[a-z0-9-_]+$/,
            'Slug может содержать только строчные латинские буквы, цифры, дефисы и нижние подчеркивания',
        ),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;