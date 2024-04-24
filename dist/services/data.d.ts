import { AsyncZippable, Unzipped } from 'fflate';
import { BaseEvents, MinimalEvents } from './events';
export declare function existsAsync(fileOrDir: string): Promise<boolean>;
export declare function zipAsync(file: AsyncZippable): Promise<Uint8Array>;
export declare function unzipAsync(data: Uint8Array): Promise<Unzipped>;
export declare function saveEvents<T extends MinimalEvents>({ name, userDirectory, events, }: {
    name: string;
    userDirectory: string;
    events: T[];
}): Promise<void>;
export declare function loadSavedEvents<T extends MinimalEvents>({ name, userDirectory, deployedBlock, }: {
    name: string;
    userDirectory: string;
    deployedBlock: number;
}): Promise<BaseEvents<T>>;
export declare function download({ name, cacheDirectory }: {
    name: string;
    cacheDirectory: string;
}): Promise<string>;
export declare function loadCachedEvents<T extends MinimalEvents>({ name, cacheDirectory, deployedBlock, }: {
    name: string;
    cacheDirectory: string;
    deployedBlock: number;
}): Promise<BaseEvents<T>>;
