import { Suspense } from 'react';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Suspense
                fallback={
                    <div className="text-sm text-slate-400 animate-pulse">
                        Загрузка формы авторизации...
                    </div>
                }
            >
                <LoginForm />
            </Suspense>
        </main>
    );
}
