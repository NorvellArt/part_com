import { Suspense } from 'react';
import { RegisterForm } from '@/features/auth';

export default function RegisterPage() {
    return (
        <div className="flex h-[calc(100dvh-64px)] items-center justify-center -mx-4 -my-4 md:-mx-6 md:-my-6 overflow-hidden">
            <Suspense
                fallback={
                    <div className="text-sm text-slate-400 animate-pulse">
                        Загрузка формы авторизации...
                    </div>
                }
            >
                <RegisterForm />
            </Suspense>
        </div>
    );
}
