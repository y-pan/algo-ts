export interface ITreeNode<K, V> {
    getKey(): K;
    getVal(): V;

    // add(key: K, val: V): void;
    getLeft(): ITreeNode<K, V> | undefined;
    getRight(): ITreeNode<K, V> | undefined;

    setVal(val: V): void;
    setLeft(left: ITreeNode<K, V>): void;
    setRight(right: ITreeNode<K, V>): void;

    getSize(): number;
    setSize(size: number): void;
}