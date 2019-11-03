import {ITreeNode} from "./ITreeNode";

export interface IRedBlackTreeNode<K, V> extends ITreeNode<K, V> {
    isRed(): boolean;
    setRed(isRed: boolean): void;
}