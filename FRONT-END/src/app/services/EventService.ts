import { Injectable } from "@angular/core";

@Injectable()
export class EventService {

    public listeners: Listener[] = [];


    public listenFor<T>(subscriber: any, event: string, callback: (data: T) => void): void {
        this.listeners.push({
            subscriber: subscriber,
            event: event,
            callback: callback
        });
    }

    public stopListeningAll(subscriber: any): void {
        this.listeners.filter((listener) => {
            if (subscriber === listener.subscriber) {
                return listener;
            }
        }).forEach((listener) => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        });
    }

    public stopListeningEvent(subscriber: any, event: string) {
        this.listeners.filter((listener) => {
            if (subscriber === listener.subscriber && event === listener.event) {
                return listener;
            }
        }).forEach((listener) => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        });
    }

    public emit<T>(event: string, data: T): void {
        this.listeners.forEach((listener) => {
            if (listener.event === event) {
                listener.callback(data);
            }
        });
    }

}

export interface Listener {
    subscriber: any,
    event: string,
    callback: (data: any) => void
}