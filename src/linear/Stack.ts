import {LinkNode} from "./LinkNode";
import {AbstractList} from "./AbstractList";
import {requireNonNull} from "../utils/Type";

export class Stack<T> extends AbstractList<T> {
    constructor() {
        super();
    }

    add(val: T): void {// add to head
        requireNonNull(val, `add() requires: value non null`);

        const newNode = new LinkNode(val);
        if (!this._root) {
            this._root = newNode;
        } else {
            newNode.next = this._root;
            this._root = newNode;
        }
        this._size++;
    }
}