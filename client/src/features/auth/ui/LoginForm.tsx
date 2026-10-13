'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useLogin,
    loginSchema,
    type LoginFormValues,
    AuthField,
} from '@/features/auth';
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

export function LoginForm() {
    const { mutate: login, isPending, error: serverError } = useLogin();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onTouched',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        login({ email: data.email, password: data.password });
    };

    return (
        <Card className="w-full sm:w-[400px] shadow-lg border-muted/70 bg-card rounded-xl overflow-hidden">
            <CardHeader className="space-y-1.5 pt-6 px-6 pb-4">
                <div className="flex items-center mb-1">
                    <Link
                        href="/"
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                            className:
                                'gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 h-auto rounded-md -ml-2',
                        })}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        На главную
                    </Link>
                </div>

                <div className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                        Вход в систему
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Введите свои данные для авторизации
                    </p>
                </div>
            </CardHeader>

            <CardContent className="px-6 py-2">
                <form
                    id="login-form"
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
                                        'Неверный Email или пароль'}
                                </AlertDescription>
                            </Alert>
                        )}

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
                            name="password"
                            label="Пароль"
                            type="password"
                            autoComplete="current-password"
                            control={form.control}
                            disabled={isPending}
                        />
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-6 pt-5 pb-6 border-t border-muted/50 bg-muted/20 mt-4">
                <Button
                    type="submit"
                    form="login-form"
                    className="w-full h-9 rounded-lg shadow-sm font-medium"
                    disabled={isPending}
                >
                    {isPending ? 'Выполняется вход...' : 'Войти'}
                </Button>

                <div className="text-xs text-muted-foreground text-center w-full">
                    Нет аккаунта?{' '}
                    <Link
                        href="/register"
                        className="ml-1 text-primary underline-offset-4 hover:underline font-medium transition-colors"
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
