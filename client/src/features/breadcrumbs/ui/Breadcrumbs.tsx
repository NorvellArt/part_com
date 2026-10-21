import Link from 'next/link';
import { categoryApi, buildBreadcrumbsPath, CategoryNode } from '@/entities/category';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/shared/components';

interface BreadcrumbsProps {
    slugs: string[];
}

export async function Breadcrumbs({ slugs }: BreadcrumbsProps) {
    const tree = await categoryApi
        .getTree()
        .catch(() => [] as CategoryNode[]);

    const breadcrumbsPath = buildBreadcrumbsPath(tree, slugs);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/catalog">
                        Каталог
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbsPath.length > 0 && <BreadcrumbSeparator />}

                {breadcrumbsPath.map((item, index) => {
                    const isLast = index === breadcrumbsPath.length - 1;

                    return (
                        <div
                            key={item.url}
                            className="flex items-center gap-1.5"
                        >
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={item.url}>
                                        {item.name}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
