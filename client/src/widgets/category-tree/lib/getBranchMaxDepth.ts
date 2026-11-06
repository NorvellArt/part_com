import { CategoryNode } from "@/entities/category";

 export function getBranchMaxDepth(node: CategoryNode): number {
    if (!node.children || node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(getBranchMaxDepth));
}