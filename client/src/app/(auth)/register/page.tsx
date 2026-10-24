import { Suspense } from 'react';
import { RegisterForm } from '@/features/auth';

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Suspense
                fallback={
                    <div className="text-sm text-slate-400 animate-pulse">
                        Загрузка формы авторизации...
                    </div>
                }
            >
                <RegisterForm />
            </Suspense>
        </main>
    );
}
