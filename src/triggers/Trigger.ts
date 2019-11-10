import {nlb} from "../types/Nullable";
import {Consumer} from "../types/Consumer";
import {requireNonNull} from "../utils/Type";

export class Trigger<T> { // update value and trigger some update logic
    private _value: nlb<T>;
    private readonly _trigger: Consumer<nlb<T>>;

    constructor(value: nlb<T>, onUpdate: Consumer<nlb<T>>) {
        requireNonNull(onUpdate, "Trigger constructor requires: onUpdate function");
        this._value = value;
        this._trigger = onUpdate;

        // trigger now
        this._trigger(this._value);
    }

    get value(): nlb<T> {
        return this._value;
    }

    set value(value: nlb<T>) {
        this._value = value;
        this._trigger(this._value);
    }

}