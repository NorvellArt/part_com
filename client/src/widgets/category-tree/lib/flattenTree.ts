import { NodeModel } from '@minoru/react-dnd-treeview';
import { CategoryNode } from '@/entities/category/model/types';

export function flattenTree(nodes: CategoryNode[], parentId: string | null = null): NodeModel<CategoryNode>[] {
    return nodes.reduce((acc, node) => {
        const item: NodeModel<CategoryNode> = {
            id: node.id,
            parent: parentId ?? 'root',
            text: node.name,
            droppable: true,
            data: node
        };
        acc.push(item);
        if (node.children && node.children.length > 0) {
            acc.push(...flattenTree(node.children, node.id));
        }
        return acc;
    }, [] as NodeModel<CategoryNode>[]);
}
