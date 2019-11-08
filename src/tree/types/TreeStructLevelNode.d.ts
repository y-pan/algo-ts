import {nlb} from "../../types/Nullable";

interface TreeStructLevelNode<KEY extends number | string> {
    key: nlb<KEY>;
    x: number;
    y: number;
    r: number; // radius, or _size
    fill: string;
    stroke: string;
}