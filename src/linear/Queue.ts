import {LinkNode} from "./LinkNode";
import {AbstractList} from "./AbstractList";
import {requireNonNull} from "../utils/Type";

export class Queue<T> extends AbstractList<T> {

    add(val: T): void {// add to tail
        requireNonNull(val, `add() requires: value non null`);

        const newNode = new LinkNode(val);
        if (!this._root) {
            this._root = newNode;
        } else {
            let node = this._root;
            while (node.next) {
                node = node.next;
            }
            node.next = newNode;
        }
        this._size++;
    }
}
