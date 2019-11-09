import {Consumer} from "../types/Consumer";
import {StringMap} from "../types/StringMap";
import {uniqueId} from "../tree/util/TreeUtil";
import {nlb} from "../types/Nullable";

export class EventPublisher<T> {

    private readonly subscribers: StringMap<Consumer<T>> = {};
    private subscriberCount: number = 0;

    constructor() {
    }

    private makeKey(): string {
        return uniqueId("EventPublisher-");
    }

    subscribe(consumer: Consumer<T>): nlb<string> {
        if (typeof consumer !== "function") {
            return undefined;
        }
        const key: string = this.makeKey();
        this.subscribers[key] = consumer;
        this.subscriberCount++;
        return key;
    }

    unsubscribe(key: string): boolean {
        if (this.subscribers.hasOwnProperty(key)) {
            delete this.subscribers[key];
            this.subscriberCount--;
            return true;
        }
        return false;
    }

    publish(value: T): void {
        for (let key in this.subscribers) {
            this.subscribers[key](value);
        }
    }

    getSubscriberCount(): number {
        return this.subscriberCount;
    }
}