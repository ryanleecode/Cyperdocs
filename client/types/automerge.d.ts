declare const ROOT_ID = "00000000-0000-0000-0000-000000000000";
declare const OPTIONS: unique symbol;
declare const CACHE: unique symbol;
declare const INBOUND: unique symbol;
declare const STATE: unique symbol;
declare const OBJECT_ID: unique symbol;
declare const CONFLICTS: unique symbol;
declare const CHANGE: unique symbol;
declare const ELEM_IDS: unique symbol;
declare const MAX_ELEM: unique symbol;
interface Cache {
    [ROOT_ID]: Doc;
}
interface State {
    seq: number;
    requests: any[];
    deps: {
        [key: string]: any;
    };
    canUndo: boolean;
    canRedo: boolean;
    backendState: any;
}
export declare type Doc = Readonly<{
    [OBJECT_ID]: typeof ROOT_ID;
    [CACHE]: Cache;
    [CHANGE]: any;
    [STATE]: State;
    [OPTIONS]: any;
    [key: string]: any;
}>;

declare type SendMsgCallback = (msg: any) => void;
declare type Clock = Map<any, any>;

export class Connection {
  constructor(docSet: DocSet, sendMsg: SendMsgCallback);
  open(): void;
  close(): void;
  sendMsg(docId: string, clock: Clock, changes?: any): void;
  maybeSendChanges(docId: string): void;
  docChanged(docId: string, doc: Doc): void;
  receiveMsg(msg: any): Doc | undefined;
}
export class DocSet {
  docs: Map<string, Doc>;
  handlers: Set<Handler>;
  getDoc(docId: string): Doc | undefined;
  setDoc(docId: string, doc: Doc): void;
  applyChanges(docId: string, changes: any): Doc;
  registerHandler(handler: Handler): void;
  unregisterHandler(handler: Handler): void;
}
export class Text {
  constructor(opSet: any, objectId: any);
  concat(...args: any[]): any;
  every(...args: any[]): any;
  filter(...args: any[]): any;
  find(...args: any[]): any;
  findIndex(...args: any[]): any;
  forEach(...args: any[]): any;
  get(index: any): any;
  includes(...args: any[]): any;
  indexOf(...args: any[]): any;
  join(...args: any[]): any;
  lastIndexOf(...args: any[]): any;
  map(...args: any[]): any;
  reduce(...args: any[]): any;
  reduceRight(...args: any[]): any;
  slice(...args: any[]): any;
  some(...args: any[]): any;
  toLocaleString(...args: any[]): any;
}
export class WatchableDoc {
  constructor(doc: Doc);
  doc: Doc;
  handlers: any;
  applyChanges(changes: any): any;
  get(): any;
  registerHandler(handler: any): void;
  set(doc: Doc): void;
  unregisterHandler(handler: any): void;
}

declare function applyChanges(doc: Doc, changes: any): any;
declare function getChanges(oldDoc: Doc, newDoc: Doc): any;
export function assign(target: any, values: any): void;
declare function change(doc: Doc, message: string, callback: any): Doc;
declare function diff(oldDoc: Doc, newDoc: Doc): Operation[];
declare function emptyChange(doc: Doc, message: any): Doc;
declare function equals(val1: any, val2: any): boolean;
declare function getChanges(oldDoc: Doc, newDoc: Doc): any;
export function getChangesForActor(state: any, actorId: any): any;
export function getConflicts(doc: Doc, list: any): any;
declare function getHistory(doc: Doc): any;
export function getMissingChanges(opSet: any, haveDeps: any): any;
declare function getMissingDeps(doc: Doc): {};
declare function init(actorId?: string | number): Doc;
export function initImmutable(actorId: any): any;
export function inspect(doc: Doc): any;
declare function load(docString: string, actorId?: string): Doc;
export function loadImmutable(string: any, actorId: any): any;
export function merge(local: any, remote: any): any;
declare function save(doc: Doc): string;
export function uuid(): any;
export namespace uuid {
  function reset(): any;
  function setFactory(newFactory: any): any;
}
