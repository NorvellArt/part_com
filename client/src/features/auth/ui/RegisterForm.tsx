'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/features/auth';
import {
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Alert,
    AlertDescription,
    buttonVariants,
} from '@/shared/components';
import { ArrowLeft } from 'lucide-react';

export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const { mutate: register, isPending, error } = useRegister();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (password !== confirmPassword) {
            setValidationError('Пароли не совпадают');
            return;
        }

        register({ email, password });
    };

    const activeError = validationError || error?.message;

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between mb-2">
                    <Link
                        href="/"
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                            className:
                                'gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 h-auto',
                        })}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        На главную
                    </Link>
                </div>

                <CardTitle className="text-2xl font-bold text-center">
                    Регистрация
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {activeError && (
                        <Alert variant="destructive">
                            <AlertDescription>{activeError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Подтверждение пароля
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? 'Загрузка...' : 'Зарегистрироваться'}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4 text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <Link
                    href="/login"
                    className="ml-1 text-primary underline-offset-4 hover:underline font-medium"
                >
                    Войти
                </Link>
            </CardFooter>
        </Card>
    );
}
