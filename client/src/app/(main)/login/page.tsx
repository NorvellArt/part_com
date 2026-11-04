import { Suspense } from 'react';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
    return (
        <div className="flex h-[calc(100dvh-64px)] items-center justify-center -mx-4 -my-4 md:-mx-6 md:-my-6 overflow-hidden">
            <Suspense
                fallback={
                    <div className="text-sm text-slate-400 animate-pulse">
                        Загрузка формы авторизации...
                    </div>
                }
            >
                <LoginForm />
            </Suspense>
        </div>
    );
}
