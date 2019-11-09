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
    rank?(key: nlb<K>): number; // num of keys, which < key
    select?(rank: number): nlb<K>; // get the key, whose has that rank
    floor?(): number;
    ceiling?(): number;

    delete(key: K): nlb<N>;

    deleteMin?(): nlb<N>;

    deleteMax?(): nlb<N>;
}