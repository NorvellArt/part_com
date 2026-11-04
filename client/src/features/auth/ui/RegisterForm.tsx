'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useRegister,
    registerSchema,
    type RegisterFormValues,
} from '@/features/auth';
import { AuthField } from '@/features/auth';
import {
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Alert,
    AlertDescription,
    buttonVariants,
    FieldGroup,
} from '@/shared/components';
import { ArrowLeft } from 'lucide-react';

export function RegisterForm() {
    const { mutate: register, isPending, error: serverError } = useRegister();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onTouched',
        defaultValues: {
            email: '',
            phoneNumber: '',
            firstName: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        const normalizedPhone = data.phoneNumber.startsWith('+')
            ? '+' + data.phoneNumber.replace(/\D/g, '')
            : data.phoneNumber.replace(/\D/g, '');

        register({
            email: data.email,
            phoneNumber: normalizedPhone,
            firstName: data.firstName,
            password: data.password,
        });
    };

    return (
        <Card className="w-full sm:w-[400px] shadow-lg border-muted/70 bg-card rounded-xl overflow-hidden">
            <CardHeader className="space-y-1.5 pt-2 px-3 pb-2">
                <div className="flex items-center mb-1">
                    <Link
                        href="/"
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                            className:
                                'gap-1.5 text-xs text-muted-foreground hover:text-[var(--brand-hover)] active:text-[var(--brand-active)] px-2 py-1 h-auto rounded-md',
                        })}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        В Каталог
                    </Link>
                </div>
                <div className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                        Создать аккаунт
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="px-3">
                <form
                    id="register-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup className="flex flex-col gap-4 space-y-0 h-auto items-stretch w-full">
                        {serverError && (
                            <Alert
                                variant="destructive"
                                className="py-2.5 rounded-lg border-destructive/30 bg-destructive/10 text-destructive"
                            >
                                <AlertDescription className="text-xs font-medium">
                                    {serverError.message ||
                                        'Произошла ошибка при регистрации'}
                                </AlertDescription>
                            </Alert>
                        )}

                        <AuthField
                            name="firstName"
                            label="Имя"
                            type="text"
                            placeholder="Иван"
                            autoComplete="given-name"
                            control={form.control}
                            disabled={isPending}
                        />

                        <AuthField
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="user@example.com"
                            autoComplete="email"
                            control={form.control}
                            disabled={isPending}
                        />

                        <AuthField
                            name="phoneNumber"
                            label="Мобильный телефон"
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                            autoComplete="tel"
                            control={form.control}
                            disabled={isPending}
                        />

                        <AuthField
                            name="password"
                            label="Пароль"
                            autoComplete="new-password"
                            control={form.control}
                            disabled={isPending}
                        />

                        <AuthField
                            name="confirmPassword"
                            label="Подтверждение пароля"
                            autoComplete="new-password"
                            control={form.control}
                            disabled={isPending}
                        />
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-3 pt-2 pb-2 border-t border-muted/50 bg-[var(--brand-light)]/10">
                <Button
                    type="submit"
                    form="register-form"
                    className="w-full h-9 rounded-lg shadow-sm font-medium bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-active)] text-white transition-colors"
                    disabled={isPending}
                >
                    {isPending ? 'Создание аккаунта...' : 'Зарегистрироваться'}
                </Button>
                <div className="text-xs text-muted-foreground text-center w-full">
                    Уже есть аккаунт?
                    <Link
                        href="/login"
                        className="ml-1 text-[var(--brand)] hover:text-[var(--brand-hover)] active:text-[var(--brand-active)] underline-offset-4 hover:underline font-medium transition-colors"
                    >
                        Войти
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
