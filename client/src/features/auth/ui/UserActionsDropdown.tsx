'use client';

import Link from 'next/link';
import { User, ShieldCheck, LogOut } from 'lucide-react';
import { Session } from 'next-auth';
import { buttonVariants } from '@/shared/components';
import { LogoutButton } from './LogoutButton';
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
            <>
                <Link
                    href="/login"
                    className={buttonVariants({
                        variant: 'ghost',
                        size: 'sm',
                    })}
                >
                    Войти
                </Link>
                <Link
                    href="/register"
                    className={buttonVariants({ size: 'sm' })}
                >
                    Регистрация
                </Link>
            </>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={buttonVariants({
                    variant: 'secondary',
                    size: 'icon-lg',
                    className: 'rounded-full',
                })}
            >
                <User className="h-5 w-5 text-slate-700" />
                <span className="sr-only">Меню пользователя</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-56"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-xs leading-none text-muted-foreground">
                                Вы вошли как
                            </p>
                            <p className="text-sm font-medium leading-none text-slate-900 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {isAdmin && (
                        <>
                            <DropdownMenuItem>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 cursor-pointer w-full"
                                >
                                    <ShieldCheck className="h-4 w-4 !text-blue-600 shrink-0" />
                                    <span>Администрирование</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    <LogoutButton />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
