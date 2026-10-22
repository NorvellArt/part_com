import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/entities/session';
import { CategoryTree } from '@/widgets/category-tree/ui/CategoryTree';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components';
import { FolderTree, FileSpreadsheet, Settings } from 'lucide-react';
import { ProductModerationTable } from '@/widgets/product-moderation';

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="space-y-6 min-h-screen pb-12">
            <Tabs
                defaultValue="products"
                className="w-full space-y-4"
            >
                <TabsList className="bg-slate-100/80 p-1 border border-slate-200/50 rounded-xl">
                    <TabsTrigger
                        value="products"
                        className="gap-2 rounded-lg"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Модерация товаров
                    </TabsTrigger>
                    <TabsTrigger
                        value="categories"
                        className="gap-2 rounded-lg"
                    >
                        <FolderTree className="h-4 w-4" />
                        Категории каталога
                    </TabsTrigger>

                    <TabsTrigger
                        value="settings"
                        className="gap-2 rounded-lg"
                    >
                        <Settings className="h-4 w-4" />
                        Настройки
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="products"
                    className="border-none p-0 outline-none"
                >
                    <ProductModerationTable />
                </TabsContent>

                <TabsContent
                    value="categories"
                    className="border-none p-0 outline-none"
                >
                    <CategoryTree />
                </TabsContent>

                <TabsContent
                    value="settings"
                    className="border-none p-0 outline-none"
                >
                    <div className="bg-white p-6 rounded-xl border border-slate-200 text-center py-12 text-slate-400 text-sm">
                        Системные конфигурации каталога автозапчастей.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
