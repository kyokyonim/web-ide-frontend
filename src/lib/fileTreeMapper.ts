import type { BackendFileTreeNode } from '../api/files';
import type { FileNode } from '../types';

export function mapBackendFileTree(nodes: BackendFileTreeNode[]): FileNode[] {
  return nodes.map(mapNode);
}

function mapNode(node: BackendFileTreeNode): FileNode {
  return {
    id: String(node.id),
    name: node.name,
    type: node.type === 'FOLDER' ? 'folder' : 'file',
    children: node.children?.length ? node.children.map(mapNode) : undefined,
  };
}
