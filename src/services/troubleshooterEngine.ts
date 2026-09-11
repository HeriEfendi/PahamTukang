import { ProjectCategory, TroubleshooterNode, TroubleshooterTree } from '../types';
import { TROUBLESHOOTER_TREES } from '../data/troubleshooterData';

export class TroubleshooterEngine {
  static getAllTrees(): TroubleshooterTree[] {
    return TROUBLESHOOTER_TREES;
  }

  static getTreesByCategory(category?: ProjectCategory): TroubleshooterTree[] {
    if (!category) return TROUBLESHOOTER_TREES;
    return TROUBLESHOOTER_TREES.filter((t) => t.category === category);
  }

  static getTreeById(id: string): TroubleshooterTree | undefined {
    return TROUBLESHOOTER_TREES.find((t) => t.id === id);
  }

  static getNode(tree: TroubleshooterTree, nodeId: string): TroubleshooterNode | undefined {
    return tree.nodes[nodeId];
  }
}
