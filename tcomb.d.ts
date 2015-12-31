declare module tcomb {

  type Predicate = (x: any) => boolean;

  interface Type<T> extends Function {
    (value: T): T;
    is: Predicate;
    displayName: string;
    meta: {
      kind: string,
      name: string,
      identity: boolean
    };
    t: T;
  }

  //
  // irreducible
  //

  interface Irreducible<T> extends Type<T> {
    meta: {
      kind: string,
      name: string,
      identity: boolean,
      predicate: Predicate
    };
  }

  export function irreducible<T>(name: string, predicate: Predicate): Irreducible<T>;

  //
  // basic types
  //

  export var Any: Irreducible<any>;
  export var Nil: Irreducible<void>;
  export var String: Irreducible<string>;
  export var Number: Irreducible<number>;
  export var Boolean: Irreducible<boolean>;
  export var Array: Irreducible<Array<any>>;
  export var Object: Irreducible<Object>; // FIXME restrict to POJOs
  export var Function: Irreducible<Function>;
  export var Error: Irreducible<Error>;
  export var RegExp: Irreducible<RegExp>;
  export var Date: Irreducible<Date>;

  interface ApplyCommand { $apply: Function; }
  interface PushCommand { $push: Array<any>; }
  interface RemoveCommand { $remove: Array<string>; }
  interface SetCommand { $set: any; }
  interface SpliceCommand { $splice: Array<Array<any>>; }
  interface SwapCommand { $swap: { from: number; to: number; }; }
  interface UnshiftCommand { $unshift: Array<any>; }
  interface MergeCommand { $merge: Object; }
  type Command = ApplyCommand | PushCommand | RemoveCommand | SetCommand | SpliceCommand | SwapCommand | UnshiftCommand | MergeCommand;
  type Spec = Command | {[key: string]: Spec};

  type Update<T> = (instance: T, spec: Spec) => T;

  type Constructor<T> = Type<T> | Function;

  //
  // refinement
  //

  interface Refinement<T> extends Type<T> {
    meta: {
      kind: string,
      name: string,
      identity: boolean,
      type: Constructor<T>,
      predicate: Predicate
    };
    update: Update<T>;
  }

  export function refinement<T>(type: Constructor<T>, predicate: Predicate, name?: string): Refinement<T>;

  //
  // struct
  //

  type Props = {[key: string]: Constructor<any>};
  type Mixin = Props | Struct<any>;

  interface Struct<T> extends Type<T> {
    new (value: T): T;
    meta: {
      kind: string,
      name: string,
      identity: boolean,
      props: Props
    };
    update: Update<T>;
    extend<E extends T>(mixins: Mixin | Array<Mixin>, name?: string): Struct<E>;
  }

  export function struct<T>(props: Props, name?: string): Struct<T>;

  //
  // list
  //

  interface List<T> extends Type<Array<T>> {
    meta: {
      kind: string,
      name: string,
      identity: boolean,
      type: Constructor<T>
    };
    update: Update<Array<T>>;
  }

  export function list<T>(type: Constructor<T>, name?: string): List<T>;

  //
  // dict combinator
  //

  interface Dict<D, C> extends Type<{[key: string]: C;}> {
    meta: {
      kind: string,
      name: string,
      identity: boolean,
      domain: Constructor<D>,
      codomain: Constructor<C>
    };
    update: Update<{[key: string]: C;}>;
  }

  export function dict<D, C>(domain: Constructor<D>, codomain: Constructor<C>, name?: string): Dict<C, D>;

  //
  // enums combinator
  //

  //
  // maybe combinator
  //

  //
  // tuple combinator
  //

  //
  // union combinator
  //

  //
  // intersection combinator
  //

  //
  // func combinator
  //

  //
  // declare combinator
  //

  //
  // other exports
  //

  export function is<T>(x: any, type: Constructor<T>): boolean;
  export function assert(guard: boolean, message?: string): void;
  export function fail(message: string): void;
  export function isType<T>(x: Constructor<T>): boolean;
  export function getTypeName<T>(x: Constructor<T>): string;
  export function mixin(target: Object, source: Object, overwrite?: boolean): Object;
  export function match(...args: Array<any>): any; // FIXME
  export var update: Update<Object>;
}

declare module "tcomb" {
  export = tcomb
}