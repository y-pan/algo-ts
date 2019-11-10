import {nlb} from "../../types/Nullable";

interface TreeStructLevelNodeLabel<KEY extends number | string> {
    key: nlb<KEY>;
    text: string;
    x: number;
    y: number;
    // fontSize: number;
    fill: string;
}