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
        <div className="space-y-6 min-h-screen pb-12 px-4 sm:px-0">
            <Tabs
                defaultValue="products"
                className="w-full space-y-4"
            >
                <div className="w-full overflow-x-auto pb-1 -mb-1 max-w-[100vw] scrollbar-none">
                    <TabsList className="bg-slate-100/80 p-1 border border-slate-200/50 rounded-xl inline-flex min-w-full sm:min-w-0 whitespace-nowrap">
                        <TabsTrigger
                            value="products"
                            className="gap-2 rounded-lg text-xs font-medium px-4 py-2 transition-all data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm cursor-pointer shrink-0"
                        >
                            <FileSpreadsheet className="h-4 w-4 shrink-0" />
                            Модерация товаров
                        </TabsTrigger>

                        <TabsTrigger
                            value="categories"
                            className="gap-2 rounded-lg text-xs font-medium px-4 py-2 transition-all data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm cursor-pointer shrink-0"
                        >
                            <FolderTree className="h-4 w-4 shrink-0" />
                            Категории каталога
                        </TabsTrigger>

                        <TabsTrigger
                            value="settings"
                            className="gap-2 rounded-lg text-xs font-medium px-4 py-2 transition-all data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm cursor-pointer shrink-0"
                        >
                            <Settings className="h-4 w-4 shrink-0" />
                            Настройки
                        </TabsTrigger>
                    </TabsList>
                </div>

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
                    <div className="bg-white p-6 rounded-xl border border-slate-200 text-center py-12 text-slate-400 text-sm shadow-sm">
                        Системные конфигурации каталога автозапчастей.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
