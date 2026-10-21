import { CategoryNode } from "./types";

export function buildBreadcrumbsPath(tree: CategoryNode[], slugs: string[]) {
    const breadcrumbs: { name: string; url: string }[] = [];
    let currentLevel = tree;
    let currentUrl = '/catalog';

    for (const slug of slugs) {
        const found = currentLevel.find((node) => node.slug === slug);
        if (!found) break;

        currentUrl += `/${found.slug}`;
        breadcrumbs.push({
            name: found.name,
            url: currentUrl,
        });

        if (found.children) {
            currentLevel = found.children;
        } else {
            break;
        }
    }

    return breadcrumbs;
}