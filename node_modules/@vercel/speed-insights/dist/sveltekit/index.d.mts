interface SpeedInsightsProps {
    dsn?: string;
    sampleRate?: number;
    route?: string | null;
    beforeSend?: BeforeSend;
    debug?: boolean;
    /** Set to false to disable soft-navigation reporting. Enabled (true) by default. */
    softNavs?: boolean;
    scriptSrc?: string;
    endpoint?: string;
}
type EventTypes = 'vital';
interface BeforeSendEvent {
    type: EventTypes;
    url: string;
    route?: string;
}
type BeforeSend = (event: BeforeSendEvent) => BeforeSendEvent | null | undefined | false;
interface Functions {
    beforeSend?: BeforeSend;
}
interface SpeedInsights<T extends keyof Functions = keyof Functions> {
    queue: [T, Functions[T]][];
    addAction: (action: T, data: Functions[T]) => void;
}
declare global {
    interface Window {
        /** Base interface to track events */
        si?: SpeedInsights['addAction'];
        /** Queue for speed insights datapoints, before the library is loaded */
        siq?: SpeedInsights['queue'];
        sil?: boolean;
        /** used by Astro component only */
        speedInsightsBeforeSend?: BeforeSend;
    }
}

/**
 * Injects Vercel Speed Insights in SvelteKit 2 apps.
 */
declare function injectSpeedInsights(props?: Omit<SpeedInsightsProps, 'framework'>): void;

export { type BeforeSend, type BeforeSendEvent, type SpeedInsightsProps, injectSpeedInsights };
