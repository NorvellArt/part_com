'use client';

import { useState } from 'react';
import { useLogin } from '@/features/auth/model/useLogin';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate: login, isPending, error } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full p-6 border rounded-lg shadow-sm bg-card">
            <h1 className="text-2xl font-bold text-center">Вход в систему</h1>

            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                    {error.message}
                </div>
            )}

            <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="user@example.com"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">Пароль</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50"
            >
                {isPending ? 'Выполняется вход...' : 'Войти'}
            </button>
        </form>
    );
}