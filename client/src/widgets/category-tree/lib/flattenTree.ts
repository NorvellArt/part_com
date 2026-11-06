import { CategoryNode } from "@/entities/category";
import { NodeModel } from "@minoru/react-dnd-treeview";

export function flattenTree(
    categories: CategoryNode[],
    parentId: string | number = 'root',
    level = 1
): NodeModel<CategoryNode>[] {
    let result: NodeModel<CategoryNode>[] = [];

    categories.forEach((node) => {
        result.push({
            id: node.id,
            parent: parentId,
            text: node.name,
            data: {
                ...node,
                level: level
            },
        });

        if (node.children && node.children.length > 0) {
            result = result.concat(
                flattenTree(node.children, node.id, level + 1)
            );
        }
    });

    return result;
}