import { NodeModel } from '@minoru/react-dnd-treeview';

export interface BaseNodeWithChildren {
    children?: BaseNodeWithChildren[];
    [key: string]: any;
}

export function getBranchMaxDepth<T extends BaseNodeWithChildren>(node: T): number {
    if (!node.children || node.children.length === 0) return 1;

    return 1 + Math.max(...(node.children as T[]).map((child) => getBranchMaxDepth(child)));
}

export function getNodeLevel<T>(
    flatData: NodeModel<T>[],
    targetId: string | number
): number {
    let level = 1;
    let current = flatData.find((n) => n.id === targetId);

    while (current && current.parent !== 'root' && current.parent !== undefined) {
        level++;
        const parentId = current.parent;
        current = flatData.find((n) => n.id === parentId);
    }

    return level;
}
