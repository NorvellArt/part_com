'use client';

import { useState } from 'react';
import { useLogin } from '@/features/auth/model/useLogin';
import {
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Alert,
    AlertDescription,
    CardFooter,
    buttonVariants,
} from '@/shared/components';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate: login, isPending, error } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <Card className="w-full max-w-l">
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
                    Вход в систему
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error.message}</AlertDescription>
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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? 'Выполняется вход...' : 'Войти'}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4 text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <Link
                    href="/register"
                    className="ml-1 text-primary underline-offset-4 hover:underline font-medium"
                >
                    Зарегистрироваться
                </Link>
            </CardFooter>
        </Card>
    );
}
