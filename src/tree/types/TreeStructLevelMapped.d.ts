import {BaseTreeStructLevel} from "./TreeStructLevel";

export interface TreeStructLevel extends BaseTreeStructLevel {
    mappedNodes: TreeStructLevelNode[];
    mappedLabels: TreeStructLevelNodeLabel[];
}