'use client';

import Link from 'next/link';
import { User, ShieldCheck } from 'lucide-react';
import { Session } from 'next-auth';
import { buttonVariants } from '@/shared/components';
import { LogoutButton } from './LogoutButton';
import { cn } from 'cn';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@/shared/components';

interface UserActionsDropdownProps {
    session: Session | null;
    isAdmin: boolean;
}

export function UserActionsDropdown({
    session,
    isAdmin,
}: UserActionsDropdownProps) {
    if (!session?.user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/login"
                    className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                        'text-slate-600 hover:text-[#1a4f95] hover:bg-slate-50 font-medium rounded-xl transition-colors',
                    )}
                >
                    Войти
                </Link>
                <Link
                    href="/register"
                    className={cn(
                        buttonVariants({ size: 'sm' }),
                        '!bg-[#1a4f95] hover:!bg-[#15417b] !text-white font-medium rounded-xl border-none transition-colors shadow-none',
                    )}
                >
                    Регистрация
                </Link>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    buttonVariants({ size: 'icon-lg' }),
                    'rounded-full cursor-pointer select-none border border-slate-200/60 !bg-slate-50 hover:!bg-slate-100 !text-slate-600 hover:!text-[#1a4f95] data-[state=open]:!bg-[#1a4f95] data-[state=open]:!text-white transition-all duration-200 shadow-none',
                )}
            >
                <User className="h-5 w-5" />
                <span className="sr-only">Menu</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 p-1 border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden bg-white z-50"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal p-2">
                        <div className="flex flex-col space-y-1">
                            <p className="text-xs leading-none text-muted-foreground">
                                Вы вошли как
                            </p>
                            <p className="text-sm font-semibold leading-none text-slate-800 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-100" />

                <DropdownMenuGroup>
                    {isAdmin && (
                        <>
                            <DropdownMenuItem className="rounded-xl focus:bg-slate-50 focus:text-[#1a4f95]">
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 cursor-pointer w-full py-1 text-sm font-medium"
                                >
                                    <ShieldCheck className="h-4 w-4 text-[#1a4f95] shrink-0" />
                                    <span>Администрирование</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100" />
                        </>
                    )}

                    <LogoutButton />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
