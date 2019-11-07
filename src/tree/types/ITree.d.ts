import {nlb} from "../../types/Nullable";
import {TreeNode} from "../TreeNode";

export interface ITree<K, V, N extends TreeNode<K, V>> {
    getRoot(): nlb<N>;
    put(key: K, val: V): void;

    getValue(key: K): nlb<V>;

    getNode(key: K): Nullable<N>; // For Vis processing
    contains(key: K): boolean;

    isEmpty(): boolean;

    //TODO:
    rank?(): number;
    floor?(): number;
    ceiling?(): number;

    delete(key: K): nlb<N>;
    deleteMin?(): void;
    deleteMax?(): void;
}