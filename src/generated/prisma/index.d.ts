
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Entidad
 * 
 */
export type Entidad = $Result.DefaultSelection<Prisma.$EntidadPayload>
/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Rol
 * 
 */
export type Rol = $Result.DefaultSelection<Prisma.$RolPayload>
/**
 * Model Almacen
 * 
 */
export type Almacen = $Result.DefaultSelection<Prisma.$AlmacenPayload>
/**
 * Model UsuarioAlmacen
 * 
 */
export type UsuarioAlmacen = $Result.DefaultSelection<Prisma.$UsuarioAlmacenPayload>
/**
 * Model CodigoAlmacen
 * 
 */
export type CodigoAlmacen = $Result.DefaultSelection<Prisma.$CodigoAlmacenPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Entidads
 * const entidads = await prisma.entidad.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Entidads
   * const entidads = await prisma.entidad.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.entidad`: Exposes CRUD operations for the **Entidad** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Entidads
    * const entidads = await prisma.entidad.findMany()
    * ```
    */
  get entidad(): Prisma.EntidadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rol`: Exposes CRUD operations for the **Rol** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rols
    * const rols = await prisma.rol.findMany()
    * ```
    */
  get rol(): Prisma.RolDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.almacen`: Exposes CRUD operations for the **Almacen** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Almacens
    * const almacens = await prisma.almacen.findMany()
    * ```
    */
  get almacen(): Prisma.AlmacenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usuarioAlmacen`: Exposes CRUD operations for the **UsuarioAlmacen** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsuarioAlmacens
    * const usuarioAlmacens = await prisma.usuarioAlmacen.findMany()
    * ```
    */
  get usuarioAlmacen(): Prisma.UsuarioAlmacenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.codigoAlmacen`: Exposes CRUD operations for the **CodigoAlmacen** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CodigoAlmacens
    * const codigoAlmacens = await prisma.codigoAlmacen.findMany()
    * ```
    */
  get codigoAlmacen(): Prisma.CodigoAlmacenDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Entidad: 'Entidad',
    Usuario: 'Usuario',
    Rol: 'Rol',
    Almacen: 'Almacen',
    UsuarioAlmacen: 'UsuarioAlmacen',
    CodigoAlmacen: 'CodigoAlmacen'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "entidad" | "usuario" | "rol" | "almacen" | "usuarioAlmacen" | "codigoAlmacen"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Entidad: {
        payload: Prisma.$EntidadPayload<ExtArgs>
        fields: Prisma.EntidadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EntidadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EntidadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>
          }
          findFirst: {
            args: Prisma.EntidadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EntidadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>
          }
          findMany: {
            args: Prisma.EntidadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>[]
          }
          create: {
            args: Prisma.EntidadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>
          }
          createMany: {
            args: Prisma.EntidadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EntidadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>[]
          }
          delete: {
            args: Prisma.EntidadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>
          }
          update: {
            args: Prisma.EntidadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>
          }
          deleteMany: {
            args: Prisma.EntidadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EntidadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EntidadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>[]
          }
          upsert: {
            args: Prisma.EntidadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntidadPayload>
          }
          aggregate: {
            args: Prisma.EntidadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEntidad>
          }
          groupBy: {
            args: Prisma.EntidadGroupByArgs<ExtArgs>
            result: $Utils.Optional<EntidadGroupByOutputType>[]
          }
          count: {
            args: Prisma.EntidadCountArgs<ExtArgs>
            result: $Utils.Optional<EntidadCountAggregateOutputType> | number
          }
        }
      }
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Rol: {
        payload: Prisma.$RolPayload<ExtArgs>
        fields: Prisma.RolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          findFirst: {
            args: Prisma.RolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          findMany: {
            args: Prisma.RolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>[]
          }
          create: {
            args: Prisma.RolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          createMany: {
            args: Prisma.RolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>[]
          }
          delete: {
            args: Prisma.RolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          update: {
            args: Prisma.RolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          deleteMany: {
            args: Prisma.RolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RolUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>[]
          }
          upsert: {
            args: Prisma.RolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          aggregate: {
            args: Prisma.RolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRol>
          }
          groupBy: {
            args: Prisma.RolGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolGroupByOutputType>[]
          }
          count: {
            args: Prisma.RolCountArgs<ExtArgs>
            result: $Utils.Optional<RolCountAggregateOutputType> | number
          }
        }
      }
      Almacen: {
        payload: Prisma.$AlmacenPayload<ExtArgs>
        fields: Prisma.AlmacenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlmacenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlmacenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>
          }
          findFirst: {
            args: Prisma.AlmacenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlmacenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>
          }
          findMany: {
            args: Prisma.AlmacenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>[]
          }
          create: {
            args: Prisma.AlmacenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>
          }
          createMany: {
            args: Prisma.AlmacenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlmacenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>[]
          }
          delete: {
            args: Prisma.AlmacenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>
          }
          update: {
            args: Prisma.AlmacenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>
          }
          deleteMany: {
            args: Prisma.AlmacenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlmacenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AlmacenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>[]
          }
          upsert: {
            args: Prisma.AlmacenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlmacenPayload>
          }
          aggregate: {
            args: Prisma.AlmacenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlmacen>
          }
          groupBy: {
            args: Prisma.AlmacenGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlmacenGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlmacenCountArgs<ExtArgs>
            result: $Utils.Optional<AlmacenCountAggregateOutputType> | number
          }
        }
      }
      UsuarioAlmacen: {
        payload: Prisma.$UsuarioAlmacenPayload<ExtArgs>
        fields: Prisma.UsuarioAlmacenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioAlmacenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioAlmacenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>
          }
          findFirst: {
            args: Prisma.UsuarioAlmacenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioAlmacenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>
          }
          findMany: {
            args: Prisma.UsuarioAlmacenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>[]
          }
          create: {
            args: Prisma.UsuarioAlmacenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>
          }
          createMany: {
            args: Prisma.UsuarioAlmacenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioAlmacenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>[]
          }
          delete: {
            args: Prisma.UsuarioAlmacenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>
          }
          update: {
            args: Prisma.UsuarioAlmacenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioAlmacenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioAlmacenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioAlmacenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioAlmacenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioAlmacenPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAlmacenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuarioAlmacen>
          }
          groupBy: {
            args: Prisma.UsuarioAlmacenGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioAlmacenGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioAlmacenCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioAlmacenCountAggregateOutputType> | number
          }
        }
      }
      CodigoAlmacen: {
        payload: Prisma.$CodigoAlmacenPayload<ExtArgs>
        fields: Prisma.CodigoAlmacenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CodigoAlmacenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CodigoAlmacenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>
          }
          findFirst: {
            args: Prisma.CodigoAlmacenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CodigoAlmacenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>
          }
          findMany: {
            args: Prisma.CodigoAlmacenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>[]
          }
          create: {
            args: Prisma.CodigoAlmacenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>
          }
          createMany: {
            args: Prisma.CodigoAlmacenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CodigoAlmacenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>[]
          }
          delete: {
            args: Prisma.CodigoAlmacenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>
          }
          update: {
            args: Prisma.CodigoAlmacenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>
          }
          deleteMany: {
            args: Prisma.CodigoAlmacenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CodigoAlmacenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CodigoAlmacenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>[]
          }
          upsert: {
            args: Prisma.CodigoAlmacenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoAlmacenPayload>
          }
          aggregate: {
            args: Prisma.CodigoAlmacenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCodigoAlmacen>
          }
          groupBy: {
            args: Prisma.CodigoAlmacenGroupByArgs<ExtArgs>
            result: $Utils.Optional<CodigoAlmacenGroupByOutputType>[]
          }
          count: {
            args: Prisma.CodigoAlmacenCountArgs<ExtArgs>
            result: $Utils.Optional<CodigoAlmacenCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    entidad?: EntidadOmit
    usuario?: UsuarioOmit
    rol?: RolOmit
    almacen?: AlmacenOmit
    usuarioAlmacen?: UsuarioAlmacenOmit
    codigoAlmacen?: CodigoAlmacenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type EntidadCountOutputType
   */

  export type EntidadCountOutputType = {
    usuarios: number
    almacenes: number
    roles: number
  }

  export type EntidadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | EntidadCountOutputTypeCountUsuariosArgs
    almacenes?: boolean | EntidadCountOutputTypeCountAlmacenesArgs
    roles?: boolean | EntidadCountOutputTypeCountRolesArgs
  }

  // Custom InputTypes
  /**
   * EntidadCountOutputType without action
   */
  export type EntidadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadCountOutputType
     */
    select?: EntidadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EntidadCountOutputType without action
   */
  export type EntidadCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
  }

  /**
   * EntidadCountOutputType without action
   */
  export type EntidadCountOutputTypeCountAlmacenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlmacenWhereInput
  }

  /**
   * EntidadCountOutputType without action
   */
  export type EntidadCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolWhereInput
  }


  /**
   * Count Type UsuarioCountOutputType
   */

  export type UsuarioCountOutputType = {
    roles: number
    almacenes: number
  }

  export type UsuarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | UsuarioCountOutputTypeCountRolesArgs
    almacenes?: boolean | UsuarioCountOutputTypeCountAlmacenesArgs
  }

  // Custom InputTypes
  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioCountOutputType
     */
    select?: UsuarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountAlmacenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioAlmacenWhereInput
  }


  /**
   * Count Type RolCountOutputType
   */

  export type RolCountOutputType = {
    usuarios: number
  }

  export type RolCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | RolCountOutputTypeCountUsuariosArgs
  }

  // Custom InputTypes
  /**
   * RolCountOutputType without action
   */
  export type RolCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolCountOutputType
     */
    select?: RolCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RolCountOutputType without action
   */
  export type RolCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
  }


  /**
   * Count Type AlmacenCountOutputType
   */

  export type AlmacenCountOutputType = {
    usuarios: number
    codigos: number
  }

  export type AlmacenCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | AlmacenCountOutputTypeCountUsuariosArgs
    codigos?: boolean | AlmacenCountOutputTypeCountCodigosArgs
  }

  // Custom InputTypes
  /**
   * AlmacenCountOutputType without action
   */
  export type AlmacenCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlmacenCountOutputType
     */
    select?: AlmacenCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AlmacenCountOutputType without action
   */
  export type AlmacenCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioAlmacenWhereInput
  }

  /**
   * AlmacenCountOutputType without action
   */
  export type AlmacenCountOutputTypeCountCodigosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodigoAlmacenWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Entidad
   */

  export type AggregateEntidad = {
    _count: EntidadCountAggregateOutputType | null
    _avg: EntidadAvgAggregateOutputType | null
    _sum: EntidadSumAggregateOutputType | null
    _min: EntidadMinAggregateOutputType | null
    _max: EntidadMaxAggregateOutputType | null
  }

  export type EntidadAvgAggregateOutputType = {
    id: number | null
  }

  export type EntidadSumAggregateOutputType = {
    id: number | null
  }

  export type EntidadMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    tipo: string | null
    correoContacto: string | null
    telefono: string | null
    direccion: string | null
    fechaCreacion: Date | null
  }

  export type EntidadMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    tipo: string | null
    correoContacto: string | null
    telefono: string | null
    direccion: string | null
    fechaCreacion: Date | null
  }

  export type EntidadCountAggregateOutputType = {
    id: number
    nombre: number
    tipo: number
    correoContacto: number
    telefono: number
    direccion: number
    fechaCreacion: number
    _all: number
  }


  export type EntidadAvgAggregateInputType = {
    id?: true
  }

  export type EntidadSumAggregateInputType = {
    id?: true
  }

  export type EntidadMinAggregateInputType = {
    id?: true
    nombre?: true
    tipo?: true
    correoContacto?: true
    telefono?: true
    direccion?: true
    fechaCreacion?: true
  }

  export type EntidadMaxAggregateInputType = {
    id?: true
    nombre?: true
    tipo?: true
    correoContacto?: true
    telefono?: true
    direccion?: true
    fechaCreacion?: true
  }

  export type EntidadCountAggregateInputType = {
    id?: true
    nombre?: true
    tipo?: true
    correoContacto?: true
    telefono?: true
    direccion?: true
    fechaCreacion?: true
    _all?: true
  }

  export type EntidadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Entidad to aggregate.
     */
    where?: EntidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entidads to fetch.
     */
    orderBy?: EntidadOrderByWithRelationInput | EntidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EntidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Entidads
    **/
    _count?: true | EntidadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EntidadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EntidadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EntidadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EntidadMaxAggregateInputType
  }

  export type GetEntidadAggregateType<T extends EntidadAggregateArgs> = {
        [P in keyof T & keyof AggregateEntidad]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEntidad[P]>
      : GetScalarType<T[P], AggregateEntidad[P]>
  }




  export type EntidadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntidadWhereInput
    orderBy?: EntidadOrderByWithAggregationInput | EntidadOrderByWithAggregationInput[]
    by: EntidadScalarFieldEnum[] | EntidadScalarFieldEnum
    having?: EntidadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EntidadCountAggregateInputType | true
    _avg?: EntidadAvgAggregateInputType
    _sum?: EntidadSumAggregateInputType
    _min?: EntidadMinAggregateInputType
    _max?: EntidadMaxAggregateInputType
  }

  export type EntidadGroupByOutputType = {
    id: number
    nombre: string
    tipo: string
    correoContacto: string
    telefono: string | null
    direccion: string | null
    fechaCreacion: Date
    _count: EntidadCountAggregateOutputType | null
    _avg: EntidadAvgAggregateOutputType | null
    _sum: EntidadSumAggregateOutputType | null
    _min: EntidadMinAggregateOutputType | null
    _max: EntidadMaxAggregateOutputType | null
  }

  type GetEntidadGroupByPayload<T extends EntidadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EntidadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EntidadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EntidadGroupByOutputType[P]>
            : GetScalarType<T[P], EntidadGroupByOutputType[P]>
        }
      >
    >


  export type EntidadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    tipo?: boolean
    correoContacto?: boolean
    telefono?: boolean
    direccion?: boolean
    fechaCreacion?: boolean
    usuarios?: boolean | Entidad$usuariosArgs<ExtArgs>
    almacenes?: boolean | Entidad$almacenesArgs<ExtArgs>
    roles?: boolean | Entidad$rolesArgs<ExtArgs>
    _count?: boolean | EntidadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["entidad"]>

  export type EntidadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    tipo?: boolean
    correoContacto?: boolean
    telefono?: boolean
    direccion?: boolean
    fechaCreacion?: boolean
  }, ExtArgs["result"]["entidad"]>

  export type EntidadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    tipo?: boolean
    correoContacto?: boolean
    telefono?: boolean
    direccion?: boolean
    fechaCreacion?: boolean
  }, ExtArgs["result"]["entidad"]>

  export type EntidadSelectScalar = {
    id?: boolean
    nombre?: boolean
    tipo?: boolean
    correoContacto?: boolean
    telefono?: boolean
    direccion?: boolean
    fechaCreacion?: boolean
  }

  export type EntidadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "tipo" | "correoContacto" | "telefono" | "direccion" | "fechaCreacion", ExtArgs["result"]["entidad"]>
  export type EntidadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | Entidad$usuariosArgs<ExtArgs>
    almacenes?: boolean | Entidad$almacenesArgs<ExtArgs>
    roles?: boolean | Entidad$rolesArgs<ExtArgs>
    _count?: boolean | EntidadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EntidadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EntidadIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EntidadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Entidad"
    objects: {
      usuarios: Prisma.$UsuarioPayload<ExtArgs>[]
      almacenes: Prisma.$AlmacenPayload<ExtArgs>[]
      roles: Prisma.$RolPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      tipo: string
      correoContacto: string
      telefono: string | null
      direccion: string | null
      fechaCreacion: Date
    }, ExtArgs["result"]["entidad"]>
    composites: {}
  }

  type EntidadGetPayload<S extends boolean | null | undefined | EntidadDefaultArgs> = $Result.GetResult<Prisma.$EntidadPayload, S>

  type EntidadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EntidadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EntidadCountAggregateInputType | true
    }

  export interface EntidadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Entidad'], meta: { name: 'Entidad' } }
    /**
     * Find zero or one Entidad that matches the filter.
     * @param {EntidadFindUniqueArgs} args - Arguments to find a Entidad
     * @example
     * // Get one Entidad
     * const entidad = await prisma.entidad.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EntidadFindUniqueArgs>(args: SelectSubset<T, EntidadFindUniqueArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Entidad that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EntidadFindUniqueOrThrowArgs} args - Arguments to find a Entidad
     * @example
     * // Get one Entidad
     * const entidad = await prisma.entidad.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EntidadFindUniqueOrThrowArgs>(args: SelectSubset<T, EntidadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Entidad that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadFindFirstArgs} args - Arguments to find a Entidad
     * @example
     * // Get one Entidad
     * const entidad = await prisma.entidad.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EntidadFindFirstArgs>(args?: SelectSubset<T, EntidadFindFirstArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Entidad that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadFindFirstOrThrowArgs} args - Arguments to find a Entidad
     * @example
     * // Get one Entidad
     * const entidad = await prisma.entidad.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EntidadFindFirstOrThrowArgs>(args?: SelectSubset<T, EntidadFindFirstOrThrowArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Entidads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Entidads
     * const entidads = await prisma.entidad.findMany()
     * 
     * // Get first 10 Entidads
     * const entidads = await prisma.entidad.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const entidadWithIdOnly = await prisma.entidad.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EntidadFindManyArgs>(args?: SelectSubset<T, EntidadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Entidad.
     * @param {EntidadCreateArgs} args - Arguments to create a Entidad.
     * @example
     * // Create one Entidad
     * const Entidad = await prisma.entidad.create({
     *   data: {
     *     // ... data to create a Entidad
     *   }
     * })
     * 
     */
    create<T extends EntidadCreateArgs>(args: SelectSubset<T, EntidadCreateArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Entidads.
     * @param {EntidadCreateManyArgs} args - Arguments to create many Entidads.
     * @example
     * // Create many Entidads
     * const entidad = await prisma.entidad.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EntidadCreateManyArgs>(args?: SelectSubset<T, EntidadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Entidads and returns the data saved in the database.
     * @param {EntidadCreateManyAndReturnArgs} args - Arguments to create many Entidads.
     * @example
     * // Create many Entidads
     * const entidad = await prisma.entidad.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Entidads and only return the `id`
     * const entidadWithIdOnly = await prisma.entidad.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EntidadCreateManyAndReturnArgs>(args?: SelectSubset<T, EntidadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Entidad.
     * @param {EntidadDeleteArgs} args - Arguments to delete one Entidad.
     * @example
     * // Delete one Entidad
     * const Entidad = await prisma.entidad.delete({
     *   where: {
     *     // ... filter to delete one Entidad
     *   }
     * })
     * 
     */
    delete<T extends EntidadDeleteArgs>(args: SelectSubset<T, EntidadDeleteArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Entidad.
     * @param {EntidadUpdateArgs} args - Arguments to update one Entidad.
     * @example
     * // Update one Entidad
     * const entidad = await prisma.entidad.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EntidadUpdateArgs>(args: SelectSubset<T, EntidadUpdateArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Entidads.
     * @param {EntidadDeleteManyArgs} args - Arguments to filter Entidads to delete.
     * @example
     * // Delete a few Entidads
     * const { count } = await prisma.entidad.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EntidadDeleteManyArgs>(args?: SelectSubset<T, EntidadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Entidads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Entidads
     * const entidad = await prisma.entidad.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EntidadUpdateManyArgs>(args: SelectSubset<T, EntidadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Entidads and returns the data updated in the database.
     * @param {EntidadUpdateManyAndReturnArgs} args - Arguments to update many Entidads.
     * @example
     * // Update many Entidads
     * const entidad = await prisma.entidad.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Entidads and only return the `id`
     * const entidadWithIdOnly = await prisma.entidad.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EntidadUpdateManyAndReturnArgs>(args: SelectSubset<T, EntidadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Entidad.
     * @param {EntidadUpsertArgs} args - Arguments to update or create a Entidad.
     * @example
     * // Update or create a Entidad
     * const entidad = await prisma.entidad.upsert({
     *   create: {
     *     // ... data to create a Entidad
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Entidad we want to update
     *   }
     * })
     */
    upsert<T extends EntidadUpsertArgs>(args: SelectSubset<T, EntidadUpsertArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Entidads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadCountArgs} args - Arguments to filter Entidads to count.
     * @example
     * // Count the number of Entidads
     * const count = await prisma.entidad.count({
     *   where: {
     *     // ... the filter for the Entidads we want to count
     *   }
     * })
    **/
    count<T extends EntidadCountArgs>(
      args?: Subset<T, EntidadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EntidadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Entidad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EntidadAggregateArgs>(args: Subset<T, EntidadAggregateArgs>): Prisma.PrismaPromise<GetEntidadAggregateType<T>>

    /**
     * Group by Entidad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EntidadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EntidadGroupByArgs['orderBy'] }
        : { orderBy?: EntidadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EntidadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntidadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Entidad model
   */
  readonly fields: EntidadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Entidad.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EntidadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuarios<T extends Entidad$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, Entidad$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    almacenes<T extends Entidad$almacenesArgs<ExtArgs> = {}>(args?: Subset<T, Entidad$almacenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    roles<T extends Entidad$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Entidad$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Entidad model
   */
  interface EntidadFieldRefs {
    readonly id: FieldRef<"Entidad", 'Int'>
    readonly nombre: FieldRef<"Entidad", 'String'>
    readonly tipo: FieldRef<"Entidad", 'String'>
    readonly correoContacto: FieldRef<"Entidad", 'String'>
    readonly telefono: FieldRef<"Entidad", 'String'>
    readonly direccion: FieldRef<"Entidad", 'String'>
    readonly fechaCreacion: FieldRef<"Entidad", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Entidad findUnique
   */
  export type EntidadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * Filter, which Entidad to fetch.
     */
    where: EntidadWhereUniqueInput
  }

  /**
   * Entidad findUniqueOrThrow
   */
  export type EntidadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * Filter, which Entidad to fetch.
     */
    where: EntidadWhereUniqueInput
  }

  /**
   * Entidad findFirst
   */
  export type EntidadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * Filter, which Entidad to fetch.
     */
    where?: EntidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entidads to fetch.
     */
    orderBy?: EntidadOrderByWithRelationInput | EntidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Entidads.
     */
    cursor?: EntidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Entidads.
     */
    distinct?: EntidadScalarFieldEnum | EntidadScalarFieldEnum[]
  }

  /**
   * Entidad findFirstOrThrow
   */
  export type EntidadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * Filter, which Entidad to fetch.
     */
    where?: EntidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entidads to fetch.
     */
    orderBy?: EntidadOrderByWithRelationInput | EntidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Entidads.
     */
    cursor?: EntidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Entidads.
     */
    distinct?: EntidadScalarFieldEnum | EntidadScalarFieldEnum[]
  }

  /**
   * Entidad findMany
   */
  export type EntidadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * Filter, which Entidads to fetch.
     */
    where?: EntidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entidads to fetch.
     */
    orderBy?: EntidadOrderByWithRelationInput | EntidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Entidads.
     */
    cursor?: EntidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entidads.
     */
    skip?: number
    distinct?: EntidadScalarFieldEnum | EntidadScalarFieldEnum[]
  }

  /**
   * Entidad create
   */
  export type EntidadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * The data needed to create a Entidad.
     */
    data: XOR<EntidadCreateInput, EntidadUncheckedCreateInput>
  }

  /**
   * Entidad createMany
   */
  export type EntidadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Entidads.
     */
    data: EntidadCreateManyInput | EntidadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Entidad createManyAndReturn
   */
  export type EntidadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * The data used to create many Entidads.
     */
    data: EntidadCreateManyInput | EntidadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Entidad update
   */
  export type EntidadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * The data needed to update a Entidad.
     */
    data: XOR<EntidadUpdateInput, EntidadUncheckedUpdateInput>
    /**
     * Choose, which Entidad to update.
     */
    where: EntidadWhereUniqueInput
  }

  /**
   * Entidad updateMany
   */
  export type EntidadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Entidads.
     */
    data: XOR<EntidadUpdateManyMutationInput, EntidadUncheckedUpdateManyInput>
    /**
     * Filter which Entidads to update
     */
    where?: EntidadWhereInput
    /**
     * Limit how many Entidads to update.
     */
    limit?: number
  }

  /**
   * Entidad updateManyAndReturn
   */
  export type EntidadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * The data used to update Entidads.
     */
    data: XOR<EntidadUpdateManyMutationInput, EntidadUncheckedUpdateManyInput>
    /**
     * Filter which Entidads to update
     */
    where?: EntidadWhereInput
    /**
     * Limit how many Entidads to update.
     */
    limit?: number
  }

  /**
   * Entidad upsert
   */
  export type EntidadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * The filter to search for the Entidad to update in case it exists.
     */
    where: EntidadWhereUniqueInput
    /**
     * In case the Entidad found by the `where` argument doesn't exist, create a new Entidad with this data.
     */
    create: XOR<EntidadCreateInput, EntidadUncheckedCreateInput>
    /**
     * In case the Entidad was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EntidadUpdateInput, EntidadUncheckedUpdateInput>
  }

  /**
   * Entidad delete
   */
  export type EntidadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    /**
     * Filter which Entidad to delete.
     */
    where: EntidadWhereUniqueInput
  }

  /**
   * Entidad deleteMany
   */
  export type EntidadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Entidads to delete
     */
    where?: EntidadWhereInput
    /**
     * Limit how many Entidads to delete.
     */
    limit?: number
  }

  /**
   * Entidad.usuarios
   */
  export type Entidad$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    cursor?: UsuarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Entidad.almacenes
   */
  export type Entidad$almacenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    where?: AlmacenWhereInput
    orderBy?: AlmacenOrderByWithRelationInput | AlmacenOrderByWithRelationInput[]
    cursor?: AlmacenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlmacenScalarFieldEnum | AlmacenScalarFieldEnum[]
  }

  /**
   * Entidad.roles
   */
  export type Entidad$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    where?: RolWhereInput
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    cursor?: RolWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Entidad without action
   */
  export type EntidadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
  }


  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    id: number | null
    entidadId: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    id: number | null
    entidadId: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    apellidos: string | null
    correo: string | null
    contrasena: string | null
    googleId: string | null
    tipoCuenta: string | null
    estado: string | null
    fechaRegistro: Date | null
    entidadId: number | null
    codigoUsado: string | null
    archivoNombre: string | null
    archivoBuffer: Uint8Array | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    apellidos: string | null
    correo: string | null
    contrasena: string | null
    googleId: string | null
    tipoCuenta: string | null
    estado: string | null
    fechaRegistro: Date | null
    entidadId: number | null
    codigoUsado: string | null
    archivoNombre: string | null
    archivoBuffer: Uint8Array | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    nombre: number
    apellidos: number
    correo: number
    contrasena: number
    googleId: number
    tipoCuenta: number
    estado: number
    fechaRegistro: number
    entidadId: number
    codigoUsado: number
    archivoNombre: number
    archivoBuffer: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    id?: true
    entidadId?: true
  }

  export type UsuarioSumAggregateInputType = {
    id?: true
    entidadId?: true
  }

  export type UsuarioMinAggregateInputType = {
    id?: true
    nombre?: true
    apellidos?: true
    correo?: true
    contrasena?: true
    googleId?: true
    tipoCuenta?: true
    estado?: true
    fechaRegistro?: true
    entidadId?: true
    codigoUsado?: true
    archivoNombre?: true
    archivoBuffer?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    nombre?: true
    apellidos?: true
    correo?: true
    contrasena?: true
    googleId?: true
    tipoCuenta?: true
    estado?: true
    fechaRegistro?: true
    entidadId?: true
    codigoUsado?: true
    archivoNombre?: true
    archivoBuffer?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    nombre?: true
    apellidos?: true
    correo?: true
    contrasena?: true
    googleId?: true
    tipoCuenta?: true
    estado?: true
    fechaRegistro?: true
    entidadId?: true
    codigoUsado?: true
    archivoNombre?: true
    archivoBuffer?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: number
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId: string | null
    tipoCuenta: string
    estado: string
    fechaRegistro: Date
    entidadId: number | null
    codigoUsado: string | null
    archivoNombre: string | null
    archivoBuffer: Uint8Array | null
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    apellidos?: boolean
    correo?: boolean
    contrasena?: boolean
    googleId?: boolean
    tipoCuenta?: boolean
    estado?: boolean
    fechaRegistro?: boolean
    entidadId?: boolean
    codigoUsado?: boolean
    archivoNombre?: boolean
    archivoBuffer?: boolean
    entidad?: boolean | Usuario$entidadArgs<ExtArgs>
    roles?: boolean | Usuario$rolesArgs<ExtArgs>
    almacenes?: boolean | Usuario$almacenesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    apellidos?: boolean
    correo?: boolean
    contrasena?: boolean
    googleId?: boolean
    tipoCuenta?: boolean
    estado?: boolean
    fechaRegistro?: boolean
    entidadId?: boolean
    codigoUsado?: boolean
    archivoNombre?: boolean
    archivoBuffer?: boolean
    entidad?: boolean | Usuario$entidadArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    apellidos?: boolean
    correo?: boolean
    contrasena?: boolean
    googleId?: boolean
    tipoCuenta?: boolean
    estado?: boolean
    fechaRegistro?: boolean
    entidadId?: boolean
    codigoUsado?: boolean
    archivoNombre?: boolean
    archivoBuffer?: boolean
    entidad?: boolean | Usuario$entidadArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    nombre?: boolean
    apellidos?: boolean
    correo?: boolean
    contrasena?: boolean
    googleId?: boolean
    tipoCuenta?: boolean
    estado?: boolean
    fechaRegistro?: boolean
    entidadId?: boolean
    codigoUsado?: boolean
    archivoNombre?: boolean
    archivoBuffer?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "apellidos" | "correo" | "contrasena" | "googleId" | "tipoCuenta" | "estado" | "fechaRegistro" | "entidadId" | "codigoUsado" | "archivoNombre" | "archivoBuffer", ExtArgs["result"]["usuario"]>
  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | Usuario$entidadArgs<ExtArgs>
    roles?: boolean | Usuario$rolesArgs<ExtArgs>
    almacenes?: boolean | Usuario$almacenesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | Usuario$entidadArgs<ExtArgs>
  }
  export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | Usuario$entidadArgs<ExtArgs>
  }

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      entidad: Prisma.$EntidadPayload<ExtArgs> | null
      roles: Prisma.$RolPayload<ExtArgs>[]
      almacenes: Prisma.$UsuarioAlmacenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      apellidos: string
      correo: string
      contrasena: string
      googleId: string | null
      tipoCuenta: string
      estado: string
      fechaRegistro: Date
      entidadId: number | null
      codigoUsado: string | null
      archivoNombre: string | null
      archivoBuffer: Uint8Array | null
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entidad<T extends Usuario$entidadArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$entidadArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    roles<T extends Usuario$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    almacenes<T extends Usuario$almacenesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$almacenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'Int'>
    readonly nombre: FieldRef<"Usuario", 'String'>
    readonly apellidos: FieldRef<"Usuario", 'String'>
    readonly correo: FieldRef<"Usuario", 'String'>
    readonly contrasena: FieldRef<"Usuario", 'String'>
    readonly googleId: FieldRef<"Usuario", 'String'>
    readonly tipoCuenta: FieldRef<"Usuario", 'String'>
    readonly estado: FieldRef<"Usuario", 'String'>
    readonly fechaRegistro: FieldRef<"Usuario", 'DateTime'>
    readonly entidadId: FieldRef<"Usuario", 'Int'>
    readonly codigoUsado: FieldRef<"Usuario", 'String'>
    readonly archivoNombre: FieldRef<"Usuario", 'String'>
    readonly archivoBuffer: FieldRef<"Usuario", 'Bytes'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario.entidad
   */
  export type Usuario$entidadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    where?: EntidadWhereInput
  }

  /**
   * Usuario.roles
   */
  export type Usuario$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    where?: RolWhereInput
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    cursor?: RolWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Usuario.almacenes
   */
  export type Usuario$almacenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    where?: UsuarioAlmacenWhereInput
    orderBy?: UsuarioAlmacenOrderByWithRelationInput | UsuarioAlmacenOrderByWithRelationInput[]
    cursor?: UsuarioAlmacenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuarioAlmacenScalarFieldEnum | UsuarioAlmacenScalarFieldEnum[]
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Rol
   */

  export type AggregateRol = {
    _count: RolCountAggregateOutputType | null
    _avg: RolAvgAggregateOutputType | null
    _sum: RolSumAggregateOutputType | null
    _min: RolMinAggregateOutputType | null
    _max: RolMaxAggregateOutputType | null
  }

  export type RolAvgAggregateOutputType = {
    id: number | null
    entidadId: number | null
  }

  export type RolSumAggregateOutputType = {
    id: number | null
    entidadId: number | null
  }

  export type RolMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    permisos: string | null
    entidadId: number | null
  }

  export type RolMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    permisos: string | null
    entidadId: number | null
  }

  export type RolCountAggregateOutputType = {
    id: number
    nombre: number
    descripcion: number
    permisos: number
    entidadId: number
    _all: number
  }


  export type RolAvgAggregateInputType = {
    id?: true
    entidadId?: true
  }

  export type RolSumAggregateInputType = {
    id?: true
    entidadId?: true
  }

  export type RolMinAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    permisos?: true
    entidadId?: true
  }

  export type RolMaxAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    permisos?: true
    entidadId?: true
  }

  export type RolCountAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    permisos?: true
    entidadId?: true
    _all?: true
  }

  export type RolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rol to aggregate.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rols
    **/
    _count?: true | RolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolMaxAggregateInputType
  }

  export type GetRolAggregateType<T extends RolAggregateArgs> = {
        [P in keyof T & keyof AggregateRol]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRol[P]>
      : GetScalarType<T[P], AggregateRol[P]>
  }




  export type RolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolWhereInput
    orderBy?: RolOrderByWithAggregationInput | RolOrderByWithAggregationInput[]
    by: RolScalarFieldEnum[] | RolScalarFieldEnum
    having?: RolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolCountAggregateInputType | true
    _avg?: RolAvgAggregateInputType
    _sum?: RolSumAggregateInputType
    _min?: RolMinAggregateInputType
    _max?: RolMaxAggregateInputType
  }

  export type RolGroupByOutputType = {
    id: number
    nombre: string
    descripcion: string | null
    permisos: string
    entidadId: number | null
    _count: RolCountAggregateOutputType | null
    _avg: RolAvgAggregateOutputType | null
    _sum: RolSumAggregateOutputType | null
    _min: RolMinAggregateOutputType | null
    _max: RolMaxAggregateOutputType | null
  }

  type GetRolGroupByPayload<T extends RolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolGroupByOutputType[P]>
            : GetScalarType<T[P], RolGroupByOutputType[P]>
        }
      >
    >


  export type RolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    permisos?: boolean
    entidadId?: boolean
    entidad?: boolean | Rol$entidadArgs<ExtArgs>
    usuarios?: boolean | Rol$usuariosArgs<ExtArgs>
    _count?: boolean | RolCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rol"]>

  export type RolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    permisos?: boolean
    entidadId?: boolean
    entidad?: boolean | Rol$entidadArgs<ExtArgs>
  }, ExtArgs["result"]["rol"]>

  export type RolSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    permisos?: boolean
    entidadId?: boolean
    entidad?: boolean | Rol$entidadArgs<ExtArgs>
  }, ExtArgs["result"]["rol"]>

  export type RolSelectScalar = {
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    permisos?: boolean
    entidadId?: boolean
  }

  export type RolOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "descripcion" | "permisos" | "entidadId", ExtArgs["result"]["rol"]>
  export type RolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | Rol$entidadArgs<ExtArgs>
    usuarios?: boolean | Rol$usuariosArgs<ExtArgs>
    _count?: boolean | RolCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | Rol$entidadArgs<ExtArgs>
  }
  export type RolIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | Rol$entidadArgs<ExtArgs>
  }

  export type $RolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rol"
    objects: {
      entidad: Prisma.$EntidadPayload<ExtArgs> | null
      usuarios: Prisma.$UsuarioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      descripcion: string | null
      permisos: string
      entidadId: number | null
    }, ExtArgs["result"]["rol"]>
    composites: {}
  }

  type RolGetPayload<S extends boolean | null | undefined | RolDefaultArgs> = $Result.GetResult<Prisma.$RolPayload, S>

  type RolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolCountAggregateInputType | true
    }

  export interface RolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rol'], meta: { name: 'Rol' } }
    /**
     * Find zero or one Rol that matches the filter.
     * @param {RolFindUniqueArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RolFindUniqueArgs>(args: SelectSubset<T, RolFindUniqueArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Rol that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RolFindUniqueOrThrowArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RolFindUniqueOrThrowArgs>(args: SelectSubset<T, RolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rol that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolFindFirstArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RolFindFirstArgs>(args?: SelectSubset<T, RolFindFirstArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rol that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolFindFirstOrThrowArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RolFindFirstOrThrowArgs>(args?: SelectSubset<T, RolFindFirstOrThrowArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rols that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rols
     * const rols = await prisma.rol.findMany()
     * 
     * // Get first 10 Rols
     * const rols = await prisma.rol.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rolWithIdOnly = await prisma.rol.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RolFindManyArgs>(args?: SelectSubset<T, RolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Rol.
     * @param {RolCreateArgs} args - Arguments to create a Rol.
     * @example
     * // Create one Rol
     * const Rol = await prisma.rol.create({
     *   data: {
     *     // ... data to create a Rol
     *   }
     * })
     * 
     */
    create<T extends RolCreateArgs>(args: SelectSubset<T, RolCreateArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rols.
     * @param {RolCreateManyArgs} args - Arguments to create many Rols.
     * @example
     * // Create many Rols
     * const rol = await prisma.rol.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RolCreateManyArgs>(args?: SelectSubset<T, RolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rols and returns the data saved in the database.
     * @param {RolCreateManyAndReturnArgs} args - Arguments to create many Rols.
     * @example
     * // Create many Rols
     * const rol = await prisma.rol.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rols and only return the `id`
     * const rolWithIdOnly = await prisma.rol.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RolCreateManyAndReturnArgs>(args?: SelectSubset<T, RolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Rol.
     * @param {RolDeleteArgs} args - Arguments to delete one Rol.
     * @example
     * // Delete one Rol
     * const Rol = await prisma.rol.delete({
     *   where: {
     *     // ... filter to delete one Rol
     *   }
     * })
     * 
     */
    delete<T extends RolDeleteArgs>(args: SelectSubset<T, RolDeleteArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Rol.
     * @param {RolUpdateArgs} args - Arguments to update one Rol.
     * @example
     * // Update one Rol
     * const rol = await prisma.rol.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RolUpdateArgs>(args: SelectSubset<T, RolUpdateArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rols.
     * @param {RolDeleteManyArgs} args - Arguments to filter Rols to delete.
     * @example
     * // Delete a few Rols
     * const { count } = await prisma.rol.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RolDeleteManyArgs>(args?: SelectSubset<T, RolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rols
     * const rol = await prisma.rol.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RolUpdateManyArgs>(args: SelectSubset<T, RolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rols and returns the data updated in the database.
     * @param {RolUpdateManyAndReturnArgs} args - Arguments to update many Rols.
     * @example
     * // Update many Rols
     * const rol = await prisma.rol.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rols and only return the `id`
     * const rolWithIdOnly = await prisma.rol.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RolUpdateManyAndReturnArgs>(args: SelectSubset<T, RolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Rol.
     * @param {RolUpsertArgs} args - Arguments to update or create a Rol.
     * @example
     * // Update or create a Rol
     * const rol = await prisma.rol.upsert({
     *   create: {
     *     // ... data to create a Rol
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rol we want to update
     *   }
     * })
     */
    upsert<T extends RolUpsertArgs>(args: SelectSubset<T, RolUpsertArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolCountArgs} args - Arguments to filter Rols to count.
     * @example
     * // Count the number of Rols
     * const count = await prisma.rol.count({
     *   where: {
     *     // ... the filter for the Rols we want to count
     *   }
     * })
    **/
    count<T extends RolCountArgs>(
      args?: Subset<T, RolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolAggregateArgs>(args: Subset<T, RolAggregateArgs>): Prisma.PrismaPromise<GetRolAggregateType<T>>

    /**
     * Group by Rol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RolGroupByArgs['orderBy'] }
        : { orderBy?: RolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rol model
   */
  readonly fields: RolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rol.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entidad<T extends Rol$entidadArgs<ExtArgs> = {}>(args?: Subset<T, Rol$entidadArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    usuarios<T extends Rol$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, Rol$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rol model
   */
  interface RolFieldRefs {
    readonly id: FieldRef<"Rol", 'Int'>
    readonly nombre: FieldRef<"Rol", 'String'>
    readonly descripcion: FieldRef<"Rol", 'String'>
    readonly permisos: FieldRef<"Rol", 'String'>
    readonly entidadId: FieldRef<"Rol", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Rol findUnique
   */
  export type RolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol findUniqueOrThrow
   */
  export type RolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol findFirst
   */
  export type RolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rols.
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rols.
     */
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Rol findFirstOrThrow
   */
  export type RolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rols.
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rols.
     */
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Rol findMany
   */
  export type RolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rols to fetch.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rols.
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Rol create
   */
  export type RolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * The data needed to create a Rol.
     */
    data: XOR<RolCreateInput, RolUncheckedCreateInput>
  }

  /**
   * Rol createMany
   */
  export type RolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rols.
     */
    data: RolCreateManyInput | RolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rol createManyAndReturn
   */
  export type RolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * The data used to create many Rols.
     */
    data: RolCreateManyInput | RolCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rol update
   */
  export type RolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * The data needed to update a Rol.
     */
    data: XOR<RolUpdateInput, RolUncheckedUpdateInput>
    /**
     * Choose, which Rol to update.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol updateMany
   */
  export type RolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rols.
     */
    data: XOR<RolUpdateManyMutationInput, RolUncheckedUpdateManyInput>
    /**
     * Filter which Rols to update
     */
    where?: RolWhereInput
    /**
     * Limit how many Rols to update.
     */
    limit?: number
  }

  /**
   * Rol updateManyAndReturn
   */
  export type RolUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * The data used to update Rols.
     */
    data: XOR<RolUpdateManyMutationInput, RolUncheckedUpdateManyInput>
    /**
     * Filter which Rols to update
     */
    where?: RolWhereInput
    /**
     * Limit how many Rols to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rol upsert
   */
  export type RolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * The filter to search for the Rol to update in case it exists.
     */
    where: RolWhereUniqueInput
    /**
     * In case the Rol found by the `where` argument doesn't exist, create a new Rol with this data.
     */
    create: XOR<RolCreateInput, RolUncheckedCreateInput>
    /**
     * In case the Rol was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RolUpdateInput, RolUncheckedUpdateInput>
  }

  /**
   * Rol delete
   */
  export type RolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter which Rol to delete.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol deleteMany
   */
  export type RolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rols to delete
     */
    where?: RolWhereInput
    /**
     * Limit how many Rols to delete.
     */
    limit?: number
  }

  /**
   * Rol.entidad
   */
  export type Rol$entidadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entidad
     */
    select?: EntidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entidad
     */
    omit?: EntidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntidadInclude<ExtArgs> | null
    where?: EntidadWhereInput
  }

  /**
   * Rol.usuarios
   */
  export type Rol$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    cursor?: UsuarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Rol without action
   */
  export type RolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
  }


  /**
   * Model Almacen
   */

  export type AggregateAlmacen = {
    _count: AlmacenCountAggregateOutputType | null
    _avg: AlmacenAvgAggregateOutputType | null
    _sum: AlmacenSumAggregateOutputType | null
    _min: AlmacenMinAggregateOutputType | null
    _max: AlmacenMaxAggregateOutputType | null
  }

  export type AlmacenAvgAggregateOutputType = {
    id: number | null
    entidadId: number | null
  }

  export type AlmacenSumAggregateOutputType = {
    id: number | null
    entidadId: number | null
  }

  export type AlmacenMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    imagenUrl: string | null
    codigoUnico: string | null
    funciones: string | null
    permisosPredeterminados: string | null
    fechaCreacion: Date | null
    entidadId: number | null
  }

  export type AlmacenMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    imagenUrl: string | null
    codigoUnico: string | null
    funciones: string | null
    permisosPredeterminados: string | null
    fechaCreacion: Date | null
    entidadId: number | null
  }

  export type AlmacenCountAggregateOutputType = {
    id: number
    nombre: number
    descripcion: number
    imagenUrl: number
    codigoUnico: number
    funciones: number
    permisosPredeterminados: number
    fechaCreacion: number
    entidadId: number
    _all: number
  }


  export type AlmacenAvgAggregateInputType = {
    id?: true
    entidadId?: true
  }

  export type AlmacenSumAggregateInputType = {
    id?: true
    entidadId?: true
  }

  export type AlmacenMinAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    imagenUrl?: true
    codigoUnico?: true
    funciones?: true
    permisosPredeterminados?: true
    fechaCreacion?: true
    entidadId?: true
  }

  export type AlmacenMaxAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    imagenUrl?: true
    codigoUnico?: true
    funciones?: true
    permisosPredeterminados?: true
    fechaCreacion?: true
    entidadId?: true
  }

  export type AlmacenCountAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    imagenUrl?: true
    codigoUnico?: true
    funciones?: true
    permisosPredeterminados?: true
    fechaCreacion?: true
    entidadId?: true
    _all?: true
  }

  export type AlmacenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Almacen to aggregate.
     */
    where?: AlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Almacens to fetch.
     */
    orderBy?: AlmacenOrderByWithRelationInput | AlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Almacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Almacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Almacens
    **/
    _count?: true | AlmacenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlmacenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlmacenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlmacenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlmacenMaxAggregateInputType
  }

  export type GetAlmacenAggregateType<T extends AlmacenAggregateArgs> = {
        [P in keyof T & keyof AggregateAlmacen]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlmacen[P]>
      : GetScalarType<T[P], AggregateAlmacen[P]>
  }




  export type AlmacenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlmacenWhereInput
    orderBy?: AlmacenOrderByWithAggregationInput | AlmacenOrderByWithAggregationInput[]
    by: AlmacenScalarFieldEnum[] | AlmacenScalarFieldEnum
    having?: AlmacenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlmacenCountAggregateInputType | true
    _avg?: AlmacenAvgAggregateInputType
    _sum?: AlmacenSumAggregateInputType
    _min?: AlmacenMinAggregateInputType
    _max?: AlmacenMaxAggregateInputType
  }

  export type AlmacenGroupByOutputType = {
    id: number
    nombre: string
    descripcion: string | null
    imagenUrl: string | null
    codigoUnico: string
    funciones: string | null
    permisosPredeterminados: string | null
    fechaCreacion: Date
    entidadId: number
    _count: AlmacenCountAggregateOutputType | null
    _avg: AlmacenAvgAggregateOutputType | null
    _sum: AlmacenSumAggregateOutputType | null
    _min: AlmacenMinAggregateOutputType | null
    _max: AlmacenMaxAggregateOutputType | null
  }

  type GetAlmacenGroupByPayload<T extends AlmacenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlmacenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlmacenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlmacenGroupByOutputType[P]>
            : GetScalarType<T[P], AlmacenGroupByOutputType[P]>
        }
      >
    >


  export type AlmacenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    imagenUrl?: boolean
    codigoUnico?: boolean
    funciones?: boolean
    permisosPredeterminados?: boolean
    fechaCreacion?: boolean
    entidadId?: boolean
    entidad?: boolean | EntidadDefaultArgs<ExtArgs>
    usuarios?: boolean | Almacen$usuariosArgs<ExtArgs>
    codigos?: boolean | Almacen$codigosArgs<ExtArgs>
    _count?: boolean | AlmacenCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["almacen"]>

  export type AlmacenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    imagenUrl?: boolean
    codigoUnico?: boolean
    funciones?: boolean
    permisosPredeterminados?: boolean
    fechaCreacion?: boolean
    entidadId?: boolean
    entidad?: boolean | EntidadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["almacen"]>

  export type AlmacenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    imagenUrl?: boolean
    codigoUnico?: boolean
    funciones?: boolean
    permisosPredeterminados?: boolean
    fechaCreacion?: boolean
    entidadId?: boolean
    entidad?: boolean | EntidadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["almacen"]>

  export type AlmacenSelectScalar = {
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    imagenUrl?: boolean
    codigoUnico?: boolean
    funciones?: boolean
    permisosPredeterminados?: boolean
    fechaCreacion?: boolean
    entidadId?: boolean
  }

  export type AlmacenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "descripcion" | "imagenUrl" | "codigoUnico" | "funciones" | "permisosPredeterminados" | "fechaCreacion" | "entidadId", ExtArgs["result"]["almacen"]>
  export type AlmacenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | EntidadDefaultArgs<ExtArgs>
    usuarios?: boolean | Almacen$usuariosArgs<ExtArgs>
    codigos?: boolean | Almacen$codigosArgs<ExtArgs>
    _count?: boolean | AlmacenCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AlmacenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | EntidadDefaultArgs<ExtArgs>
  }
  export type AlmacenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entidad?: boolean | EntidadDefaultArgs<ExtArgs>
  }

  export type $AlmacenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Almacen"
    objects: {
      entidad: Prisma.$EntidadPayload<ExtArgs>
      usuarios: Prisma.$UsuarioAlmacenPayload<ExtArgs>[]
      codigos: Prisma.$CodigoAlmacenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      descripcion: string | null
      imagenUrl: string | null
      codigoUnico: string
      funciones: string | null
      permisosPredeterminados: string | null
      fechaCreacion: Date
      entidadId: number
    }, ExtArgs["result"]["almacen"]>
    composites: {}
  }

  type AlmacenGetPayload<S extends boolean | null | undefined | AlmacenDefaultArgs> = $Result.GetResult<Prisma.$AlmacenPayload, S>

  type AlmacenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlmacenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlmacenCountAggregateInputType | true
    }

  export interface AlmacenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Almacen'], meta: { name: 'Almacen' } }
    /**
     * Find zero or one Almacen that matches the filter.
     * @param {AlmacenFindUniqueArgs} args - Arguments to find a Almacen
     * @example
     * // Get one Almacen
     * const almacen = await prisma.almacen.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlmacenFindUniqueArgs>(args: SelectSubset<T, AlmacenFindUniqueArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Almacen that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlmacenFindUniqueOrThrowArgs} args - Arguments to find a Almacen
     * @example
     * // Get one Almacen
     * const almacen = await prisma.almacen.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlmacenFindUniqueOrThrowArgs>(args: SelectSubset<T, AlmacenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Almacen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlmacenFindFirstArgs} args - Arguments to find a Almacen
     * @example
     * // Get one Almacen
     * const almacen = await prisma.almacen.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlmacenFindFirstArgs>(args?: SelectSubset<T, AlmacenFindFirstArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Almacen that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlmacenFindFirstOrThrowArgs} args - Arguments to find a Almacen
     * @example
     * // Get one Almacen
     * const almacen = await prisma.almacen.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlmacenFindFirstOrThrowArgs>(args?: SelectSubset<T, AlmacenFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Almacens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlmacenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Almacens
     * const almacens = await prisma.almacen.findMany()
     * 
     * // Get first 10 Almacens
     * const almacens = await prisma.almacen.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const almacenWithIdOnly = await prisma.almacen.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlmacenFindManyArgs>(args?: SelectSubset<T, AlmacenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Almacen.
     * @param {AlmacenCreateArgs} args - Arguments to create a Almacen.
     * @example
     * // Create one Almacen
     * const Almacen = await prisma.almacen.create({
     *   data: {
     *     // ... data to create a Almacen
     *   }
     * })
     * 
     */
    create<T extends AlmacenCreateArgs>(args: SelectSubset<T, AlmacenCreateArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Almacens.
     * @param {AlmacenCreateManyArgs} args - Arguments to create many Almacens.
     * @example
     * // Create many Almacens
     * const almacen = await prisma.almacen.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlmacenCreateManyArgs>(args?: SelectSubset<T, AlmacenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Almacens and returns the data saved in the database.
     * @param {AlmacenCreateManyAndReturnArgs} args - Arguments to create many Almacens.
     * @example
     * // Create many Almacens
     * const almacen = await prisma.almacen.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Almacens and only return the `id`
     * const almacenWithIdOnly = await prisma.almacen.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlmacenCreateManyAndReturnArgs>(args?: SelectSubset<T, AlmacenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Almacen.
     * @param {AlmacenDeleteArgs} args - Arguments to delete one Almacen.
     * @example
     * // Delete one Almacen
     * const Almacen = await prisma.almacen.delete({
     *   where: {
     *     // ... filter to delete one Almacen
     *   }
     * })
     * 
     */
    delete<T extends AlmacenDeleteArgs>(args: SelectSubset<T, AlmacenDeleteArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Almacen.
     * @param {AlmacenUpdateArgs} args - Arguments to update one Almacen.
     * @example
     * // Update one Almacen
     * const almacen = await prisma.almacen.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlmacenUpdateArgs>(args: SelectSubset<T, AlmacenUpdateArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Almacens.
     * @param {AlmacenDeleteManyArgs} args - Arguments to filter Almacens to delete.
     * @example
     * // Delete a few Almacens
     * const { count } = await prisma.almacen.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlmacenDeleteManyArgs>(args?: SelectSubset<T, AlmacenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Almacens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlmacenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Almacens
     * const almacen = await prisma.almacen.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlmacenUpdateManyArgs>(args: SelectSubset<T, AlmacenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Almacens and returns the data updated in the database.
     * @param {AlmacenUpdateManyAndReturnArgs} args - Arguments to update many Almacens.
     * @example
     * // Update many Almacens
     * const almacen = await prisma.almacen.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Almacens and only return the `id`
     * const almacenWithIdOnly = await prisma.almacen.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AlmacenUpdateManyAndReturnArgs>(args: SelectSubset<T, AlmacenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Almacen.
     * @param {AlmacenUpsertArgs} args - Arguments to update or create a Almacen.
     * @example
     * // Update or create a Almacen
     * const almacen = await prisma.almacen.upsert({
     *   create: {
     *     // ... data to create a Almacen
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Almacen we want to update
     *   }
     * })
     */
    upsert<T extends AlmacenUpsertArgs>(args: SelectSubset<T, AlmacenUpsertArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Almacens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlmacenCountArgs} args - Arguments to filter Almacens to count.
     * @example
     * // Count the number of Almacens
     * const count = await prisma.almacen.count({
     *   where: {
     *     // ... the filter for the Almacens we want to count
     *   }
     * })
    **/
    count<T extends AlmacenCountArgs>(
      args?: Subset<T, AlmacenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlmacenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Almacen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlmacenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlmacenAggregateArgs>(args: Subset<T, AlmacenAggregateArgs>): Prisma.PrismaPromise<GetAlmacenAggregateType<T>>

    /**
     * Group by Almacen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlmacenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlmacenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlmacenGroupByArgs['orderBy'] }
        : { orderBy?: AlmacenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlmacenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlmacenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Almacen model
   */
  readonly fields: AlmacenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Almacen.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlmacenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entidad<T extends EntidadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EntidadDefaultArgs<ExtArgs>>): Prisma__EntidadClient<$Result.GetResult<Prisma.$EntidadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    usuarios<T extends Almacen$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, Almacen$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    codigos<T extends Almacen$codigosArgs<ExtArgs> = {}>(args?: Subset<T, Almacen$codigosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Almacen model
   */
  interface AlmacenFieldRefs {
    readonly id: FieldRef<"Almacen", 'Int'>
    readonly nombre: FieldRef<"Almacen", 'String'>
    readonly descripcion: FieldRef<"Almacen", 'String'>
    readonly imagenUrl: FieldRef<"Almacen", 'String'>
    readonly codigoUnico: FieldRef<"Almacen", 'String'>
    readonly funciones: FieldRef<"Almacen", 'String'>
    readonly permisosPredeterminados: FieldRef<"Almacen", 'String'>
    readonly fechaCreacion: FieldRef<"Almacen", 'DateTime'>
    readonly entidadId: FieldRef<"Almacen", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Almacen findUnique
   */
  export type AlmacenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * Filter, which Almacen to fetch.
     */
    where: AlmacenWhereUniqueInput
  }

  /**
   * Almacen findUniqueOrThrow
   */
  export type AlmacenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * Filter, which Almacen to fetch.
     */
    where: AlmacenWhereUniqueInput
  }

  /**
   * Almacen findFirst
   */
  export type AlmacenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * Filter, which Almacen to fetch.
     */
    where?: AlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Almacens to fetch.
     */
    orderBy?: AlmacenOrderByWithRelationInput | AlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Almacens.
     */
    cursor?: AlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Almacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Almacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Almacens.
     */
    distinct?: AlmacenScalarFieldEnum | AlmacenScalarFieldEnum[]
  }

  /**
   * Almacen findFirstOrThrow
   */
  export type AlmacenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * Filter, which Almacen to fetch.
     */
    where?: AlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Almacens to fetch.
     */
    orderBy?: AlmacenOrderByWithRelationInput | AlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Almacens.
     */
    cursor?: AlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Almacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Almacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Almacens.
     */
    distinct?: AlmacenScalarFieldEnum | AlmacenScalarFieldEnum[]
  }

  /**
   * Almacen findMany
   */
  export type AlmacenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * Filter, which Almacens to fetch.
     */
    where?: AlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Almacens to fetch.
     */
    orderBy?: AlmacenOrderByWithRelationInput | AlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Almacens.
     */
    cursor?: AlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Almacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Almacens.
     */
    skip?: number
    distinct?: AlmacenScalarFieldEnum | AlmacenScalarFieldEnum[]
  }

  /**
   * Almacen create
   */
  export type AlmacenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * The data needed to create a Almacen.
     */
    data: XOR<AlmacenCreateInput, AlmacenUncheckedCreateInput>
  }

  /**
   * Almacen createMany
   */
  export type AlmacenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Almacens.
     */
    data: AlmacenCreateManyInput | AlmacenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Almacen createManyAndReturn
   */
  export type AlmacenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * The data used to create many Almacens.
     */
    data: AlmacenCreateManyInput | AlmacenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Almacen update
   */
  export type AlmacenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * The data needed to update a Almacen.
     */
    data: XOR<AlmacenUpdateInput, AlmacenUncheckedUpdateInput>
    /**
     * Choose, which Almacen to update.
     */
    where: AlmacenWhereUniqueInput
  }

  /**
   * Almacen updateMany
   */
  export type AlmacenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Almacens.
     */
    data: XOR<AlmacenUpdateManyMutationInput, AlmacenUncheckedUpdateManyInput>
    /**
     * Filter which Almacens to update
     */
    where?: AlmacenWhereInput
    /**
     * Limit how many Almacens to update.
     */
    limit?: number
  }

  /**
   * Almacen updateManyAndReturn
   */
  export type AlmacenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * The data used to update Almacens.
     */
    data: XOR<AlmacenUpdateManyMutationInput, AlmacenUncheckedUpdateManyInput>
    /**
     * Filter which Almacens to update
     */
    where?: AlmacenWhereInput
    /**
     * Limit how many Almacens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Almacen upsert
   */
  export type AlmacenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * The filter to search for the Almacen to update in case it exists.
     */
    where: AlmacenWhereUniqueInput
    /**
     * In case the Almacen found by the `where` argument doesn't exist, create a new Almacen with this data.
     */
    create: XOR<AlmacenCreateInput, AlmacenUncheckedCreateInput>
    /**
     * In case the Almacen was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlmacenUpdateInput, AlmacenUncheckedUpdateInput>
  }

  /**
   * Almacen delete
   */
  export type AlmacenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
    /**
     * Filter which Almacen to delete.
     */
    where: AlmacenWhereUniqueInput
  }

  /**
   * Almacen deleteMany
   */
  export type AlmacenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Almacens to delete
     */
    where?: AlmacenWhereInput
    /**
     * Limit how many Almacens to delete.
     */
    limit?: number
  }

  /**
   * Almacen.usuarios
   */
  export type Almacen$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    where?: UsuarioAlmacenWhereInput
    orderBy?: UsuarioAlmacenOrderByWithRelationInput | UsuarioAlmacenOrderByWithRelationInput[]
    cursor?: UsuarioAlmacenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuarioAlmacenScalarFieldEnum | UsuarioAlmacenScalarFieldEnum[]
  }

  /**
   * Almacen.codigos
   */
  export type Almacen$codigosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    where?: CodigoAlmacenWhereInput
    orderBy?: CodigoAlmacenOrderByWithRelationInput | CodigoAlmacenOrderByWithRelationInput[]
    cursor?: CodigoAlmacenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CodigoAlmacenScalarFieldEnum | CodigoAlmacenScalarFieldEnum[]
  }

  /**
   * Almacen without action
   */
  export type AlmacenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Almacen
     */
    select?: AlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Almacen
     */
    omit?: AlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlmacenInclude<ExtArgs> | null
  }


  /**
   * Model UsuarioAlmacen
   */

  export type AggregateUsuarioAlmacen = {
    _count: UsuarioAlmacenCountAggregateOutputType | null
    _avg: UsuarioAlmacenAvgAggregateOutputType | null
    _sum: UsuarioAlmacenSumAggregateOutputType | null
    _min: UsuarioAlmacenMinAggregateOutputType | null
    _max: UsuarioAlmacenMaxAggregateOutputType | null
  }

  export type UsuarioAlmacenAvgAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    almacenId: number | null
  }

  export type UsuarioAlmacenSumAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    almacenId: number | null
  }

  export type UsuarioAlmacenMinAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    almacenId: number | null
    rolEnAlmacen: string | null
    permisosExtra: string | null
  }

  export type UsuarioAlmacenMaxAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    almacenId: number | null
    rolEnAlmacen: string | null
    permisosExtra: string | null
  }

  export type UsuarioAlmacenCountAggregateOutputType = {
    id: number
    usuarioId: number
    almacenId: number
    rolEnAlmacen: number
    permisosExtra: number
    _all: number
  }


  export type UsuarioAlmacenAvgAggregateInputType = {
    id?: true
    usuarioId?: true
    almacenId?: true
  }

  export type UsuarioAlmacenSumAggregateInputType = {
    id?: true
    usuarioId?: true
    almacenId?: true
  }

  export type UsuarioAlmacenMinAggregateInputType = {
    id?: true
    usuarioId?: true
    almacenId?: true
    rolEnAlmacen?: true
    permisosExtra?: true
  }

  export type UsuarioAlmacenMaxAggregateInputType = {
    id?: true
    usuarioId?: true
    almacenId?: true
    rolEnAlmacen?: true
    permisosExtra?: true
  }

  export type UsuarioAlmacenCountAggregateInputType = {
    id?: true
    usuarioId?: true
    almacenId?: true
    rolEnAlmacen?: true
    permisosExtra?: true
    _all?: true
  }

  export type UsuarioAlmacenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsuarioAlmacen to aggregate.
     */
    where?: UsuarioAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioAlmacens to fetch.
     */
    orderBy?: UsuarioAlmacenOrderByWithRelationInput | UsuarioAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioAlmacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsuarioAlmacens
    **/
    _count?: true | UsuarioAlmacenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAlmacenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioAlmacenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioAlmacenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioAlmacenMaxAggregateInputType
  }

  export type GetUsuarioAlmacenAggregateType<T extends UsuarioAlmacenAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuarioAlmacen]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuarioAlmacen[P]>
      : GetScalarType<T[P], AggregateUsuarioAlmacen[P]>
  }




  export type UsuarioAlmacenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioAlmacenWhereInput
    orderBy?: UsuarioAlmacenOrderByWithAggregationInput | UsuarioAlmacenOrderByWithAggregationInput[]
    by: UsuarioAlmacenScalarFieldEnum[] | UsuarioAlmacenScalarFieldEnum
    having?: UsuarioAlmacenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioAlmacenCountAggregateInputType | true
    _avg?: UsuarioAlmacenAvgAggregateInputType
    _sum?: UsuarioAlmacenSumAggregateInputType
    _min?: UsuarioAlmacenMinAggregateInputType
    _max?: UsuarioAlmacenMaxAggregateInputType
  }

  export type UsuarioAlmacenGroupByOutputType = {
    id: number
    usuarioId: number
    almacenId: number
    rolEnAlmacen: string
    permisosExtra: string | null
    _count: UsuarioAlmacenCountAggregateOutputType | null
    _avg: UsuarioAlmacenAvgAggregateOutputType | null
    _sum: UsuarioAlmacenSumAggregateOutputType | null
    _min: UsuarioAlmacenMinAggregateOutputType | null
    _max: UsuarioAlmacenMaxAggregateOutputType | null
  }

  type GetUsuarioAlmacenGroupByPayload<T extends UsuarioAlmacenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioAlmacenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioAlmacenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioAlmacenGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioAlmacenGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioAlmacenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usuarioId?: boolean
    almacenId?: boolean
    rolEnAlmacen?: boolean
    permisosExtra?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuarioAlmacen"]>

  export type UsuarioAlmacenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usuarioId?: boolean
    almacenId?: boolean
    rolEnAlmacen?: boolean
    permisosExtra?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuarioAlmacen"]>

  export type UsuarioAlmacenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usuarioId?: boolean
    almacenId?: boolean
    rolEnAlmacen?: boolean
    permisosExtra?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuarioAlmacen"]>

  export type UsuarioAlmacenSelectScalar = {
    id?: boolean
    usuarioId?: boolean
    almacenId?: boolean
    rolEnAlmacen?: boolean
    permisosExtra?: boolean
  }

  export type UsuarioAlmacenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "usuarioId" | "almacenId" | "rolEnAlmacen" | "permisosExtra", ExtArgs["result"]["usuarioAlmacen"]>
  export type UsuarioAlmacenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }
  export type UsuarioAlmacenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }
  export type UsuarioAlmacenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }

  export type $UsuarioAlmacenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsuarioAlmacen"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      almacen: Prisma.$AlmacenPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      usuarioId: number
      almacenId: number
      rolEnAlmacen: string
      permisosExtra: string | null
    }, ExtArgs["result"]["usuarioAlmacen"]>
    composites: {}
  }

  type UsuarioAlmacenGetPayload<S extends boolean | null | undefined | UsuarioAlmacenDefaultArgs> = $Result.GetResult<Prisma.$UsuarioAlmacenPayload, S>

  type UsuarioAlmacenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioAlmacenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioAlmacenCountAggregateInputType | true
    }

  export interface UsuarioAlmacenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsuarioAlmacen'], meta: { name: 'UsuarioAlmacen' } }
    /**
     * Find zero or one UsuarioAlmacen that matches the filter.
     * @param {UsuarioAlmacenFindUniqueArgs} args - Arguments to find a UsuarioAlmacen
     * @example
     * // Get one UsuarioAlmacen
     * const usuarioAlmacen = await prisma.usuarioAlmacen.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioAlmacenFindUniqueArgs>(args: SelectSubset<T, UsuarioAlmacenFindUniqueArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UsuarioAlmacen that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioAlmacenFindUniqueOrThrowArgs} args - Arguments to find a UsuarioAlmacen
     * @example
     * // Get one UsuarioAlmacen
     * const usuarioAlmacen = await prisma.usuarioAlmacen.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioAlmacenFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioAlmacenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsuarioAlmacen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAlmacenFindFirstArgs} args - Arguments to find a UsuarioAlmacen
     * @example
     * // Get one UsuarioAlmacen
     * const usuarioAlmacen = await prisma.usuarioAlmacen.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioAlmacenFindFirstArgs>(args?: SelectSubset<T, UsuarioAlmacenFindFirstArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsuarioAlmacen that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAlmacenFindFirstOrThrowArgs} args - Arguments to find a UsuarioAlmacen
     * @example
     * // Get one UsuarioAlmacen
     * const usuarioAlmacen = await prisma.usuarioAlmacen.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioAlmacenFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioAlmacenFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UsuarioAlmacens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAlmacenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsuarioAlmacens
     * const usuarioAlmacens = await prisma.usuarioAlmacen.findMany()
     * 
     * // Get first 10 UsuarioAlmacens
     * const usuarioAlmacens = await prisma.usuarioAlmacen.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioAlmacenWithIdOnly = await prisma.usuarioAlmacen.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioAlmacenFindManyArgs>(args?: SelectSubset<T, UsuarioAlmacenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UsuarioAlmacen.
     * @param {UsuarioAlmacenCreateArgs} args - Arguments to create a UsuarioAlmacen.
     * @example
     * // Create one UsuarioAlmacen
     * const UsuarioAlmacen = await prisma.usuarioAlmacen.create({
     *   data: {
     *     // ... data to create a UsuarioAlmacen
     *   }
     * })
     * 
     */
    create<T extends UsuarioAlmacenCreateArgs>(args: SelectSubset<T, UsuarioAlmacenCreateArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UsuarioAlmacens.
     * @param {UsuarioAlmacenCreateManyArgs} args - Arguments to create many UsuarioAlmacens.
     * @example
     * // Create many UsuarioAlmacens
     * const usuarioAlmacen = await prisma.usuarioAlmacen.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioAlmacenCreateManyArgs>(args?: SelectSubset<T, UsuarioAlmacenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsuarioAlmacens and returns the data saved in the database.
     * @param {UsuarioAlmacenCreateManyAndReturnArgs} args - Arguments to create many UsuarioAlmacens.
     * @example
     * // Create many UsuarioAlmacens
     * const usuarioAlmacen = await prisma.usuarioAlmacen.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsuarioAlmacens and only return the `id`
     * const usuarioAlmacenWithIdOnly = await prisma.usuarioAlmacen.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioAlmacenCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioAlmacenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UsuarioAlmacen.
     * @param {UsuarioAlmacenDeleteArgs} args - Arguments to delete one UsuarioAlmacen.
     * @example
     * // Delete one UsuarioAlmacen
     * const UsuarioAlmacen = await prisma.usuarioAlmacen.delete({
     *   where: {
     *     // ... filter to delete one UsuarioAlmacen
     *   }
     * })
     * 
     */
    delete<T extends UsuarioAlmacenDeleteArgs>(args: SelectSubset<T, UsuarioAlmacenDeleteArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UsuarioAlmacen.
     * @param {UsuarioAlmacenUpdateArgs} args - Arguments to update one UsuarioAlmacen.
     * @example
     * // Update one UsuarioAlmacen
     * const usuarioAlmacen = await prisma.usuarioAlmacen.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioAlmacenUpdateArgs>(args: SelectSubset<T, UsuarioAlmacenUpdateArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UsuarioAlmacens.
     * @param {UsuarioAlmacenDeleteManyArgs} args - Arguments to filter UsuarioAlmacens to delete.
     * @example
     * // Delete a few UsuarioAlmacens
     * const { count } = await prisma.usuarioAlmacen.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioAlmacenDeleteManyArgs>(args?: SelectSubset<T, UsuarioAlmacenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsuarioAlmacens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAlmacenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsuarioAlmacens
     * const usuarioAlmacen = await prisma.usuarioAlmacen.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioAlmacenUpdateManyArgs>(args: SelectSubset<T, UsuarioAlmacenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsuarioAlmacens and returns the data updated in the database.
     * @param {UsuarioAlmacenUpdateManyAndReturnArgs} args - Arguments to update many UsuarioAlmacens.
     * @example
     * // Update many UsuarioAlmacens
     * const usuarioAlmacen = await prisma.usuarioAlmacen.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UsuarioAlmacens and only return the `id`
     * const usuarioAlmacenWithIdOnly = await prisma.usuarioAlmacen.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioAlmacenUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioAlmacenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UsuarioAlmacen.
     * @param {UsuarioAlmacenUpsertArgs} args - Arguments to update or create a UsuarioAlmacen.
     * @example
     * // Update or create a UsuarioAlmacen
     * const usuarioAlmacen = await prisma.usuarioAlmacen.upsert({
     *   create: {
     *     // ... data to create a UsuarioAlmacen
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsuarioAlmacen we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioAlmacenUpsertArgs>(args: SelectSubset<T, UsuarioAlmacenUpsertArgs<ExtArgs>>): Prisma__UsuarioAlmacenClient<$Result.GetResult<Prisma.$UsuarioAlmacenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UsuarioAlmacens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAlmacenCountArgs} args - Arguments to filter UsuarioAlmacens to count.
     * @example
     * // Count the number of UsuarioAlmacens
     * const count = await prisma.usuarioAlmacen.count({
     *   where: {
     *     // ... the filter for the UsuarioAlmacens we want to count
     *   }
     * })
    **/
    count<T extends UsuarioAlmacenCountArgs>(
      args?: Subset<T, UsuarioAlmacenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioAlmacenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsuarioAlmacen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAlmacenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAlmacenAggregateArgs>(args: Subset<T, UsuarioAlmacenAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAlmacenAggregateType<T>>

    /**
     * Group by UsuarioAlmacen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAlmacenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioAlmacenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioAlmacenGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioAlmacenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioAlmacenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioAlmacenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsuarioAlmacen model
   */
  readonly fields: UsuarioAlmacenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsuarioAlmacen.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioAlmacenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    almacen<T extends AlmacenDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlmacenDefaultArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UsuarioAlmacen model
   */
  interface UsuarioAlmacenFieldRefs {
    readonly id: FieldRef<"UsuarioAlmacen", 'Int'>
    readonly usuarioId: FieldRef<"UsuarioAlmacen", 'Int'>
    readonly almacenId: FieldRef<"UsuarioAlmacen", 'Int'>
    readonly rolEnAlmacen: FieldRef<"UsuarioAlmacen", 'String'>
    readonly permisosExtra: FieldRef<"UsuarioAlmacen", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UsuarioAlmacen findUnique
   */
  export type UsuarioAlmacenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioAlmacen to fetch.
     */
    where: UsuarioAlmacenWhereUniqueInput
  }

  /**
   * UsuarioAlmacen findUniqueOrThrow
   */
  export type UsuarioAlmacenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioAlmacen to fetch.
     */
    where: UsuarioAlmacenWhereUniqueInput
  }

  /**
   * UsuarioAlmacen findFirst
   */
  export type UsuarioAlmacenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioAlmacen to fetch.
     */
    where?: UsuarioAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioAlmacens to fetch.
     */
    orderBy?: UsuarioAlmacenOrderByWithRelationInput | UsuarioAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsuarioAlmacens.
     */
    cursor?: UsuarioAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioAlmacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsuarioAlmacens.
     */
    distinct?: UsuarioAlmacenScalarFieldEnum | UsuarioAlmacenScalarFieldEnum[]
  }

  /**
   * UsuarioAlmacen findFirstOrThrow
   */
  export type UsuarioAlmacenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioAlmacen to fetch.
     */
    where?: UsuarioAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioAlmacens to fetch.
     */
    orderBy?: UsuarioAlmacenOrderByWithRelationInput | UsuarioAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsuarioAlmacens.
     */
    cursor?: UsuarioAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioAlmacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsuarioAlmacens.
     */
    distinct?: UsuarioAlmacenScalarFieldEnum | UsuarioAlmacenScalarFieldEnum[]
  }

  /**
   * UsuarioAlmacen findMany
   */
  export type UsuarioAlmacenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioAlmacens to fetch.
     */
    where?: UsuarioAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioAlmacens to fetch.
     */
    orderBy?: UsuarioAlmacenOrderByWithRelationInput | UsuarioAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsuarioAlmacens.
     */
    cursor?: UsuarioAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioAlmacens.
     */
    skip?: number
    distinct?: UsuarioAlmacenScalarFieldEnum | UsuarioAlmacenScalarFieldEnum[]
  }

  /**
   * UsuarioAlmacen create
   */
  export type UsuarioAlmacenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * The data needed to create a UsuarioAlmacen.
     */
    data: XOR<UsuarioAlmacenCreateInput, UsuarioAlmacenUncheckedCreateInput>
  }

  /**
   * UsuarioAlmacen createMany
   */
  export type UsuarioAlmacenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsuarioAlmacens.
     */
    data: UsuarioAlmacenCreateManyInput | UsuarioAlmacenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsuarioAlmacen createManyAndReturn
   */
  export type UsuarioAlmacenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * The data used to create many UsuarioAlmacens.
     */
    data: UsuarioAlmacenCreateManyInput | UsuarioAlmacenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsuarioAlmacen update
   */
  export type UsuarioAlmacenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * The data needed to update a UsuarioAlmacen.
     */
    data: XOR<UsuarioAlmacenUpdateInput, UsuarioAlmacenUncheckedUpdateInput>
    /**
     * Choose, which UsuarioAlmacen to update.
     */
    where: UsuarioAlmacenWhereUniqueInput
  }

  /**
   * UsuarioAlmacen updateMany
   */
  export type UsuarioAlmacenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsuarioAlmacens.
     */
    data: XOR<UsuarioAlmacenUpdateManyMutationInput, UsuarioAlmacenUncheckedUpdateManyInput>
    /**
     * Filter which UsuarioAlmacens to update
     */
    where?: UsuarioAlmacenWhereInput
    /**
     * Limit how many UsuarioAlmacens to update.
     */
    limit?: number
  }

  /**
   * UsuarioAlmacen updateManyAndReturn
   */
  export type UsuarioAlmacenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * The data used to update UsuarioAlmacens.
     */
    data: XOR<UsuarioAlmacenUpdateManyMutationInput, UsuarioAlmacenUncheckedUpdateManyInput>
    /**
     * Filter which UsuarioAlmacens to update
     */
    where?: UsuarioAlmacenWhereInput
    /**
     * Limit how many UsuarioAlmacens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsuarioAlmacen upsert
   */
  export type UsuarioAlmacenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * The filter to search for the UsuarioAlmacen to update in case it exists.
     */
    where: UsuarioAlmacenWhereUniqueInput
    /**
     * In case the UsuarioAlmacen found by the `where` argument doesn't exist, create a new UsuarioAlmacen with this data.
     */
    create: XOR<UsuarioAlmacenCreateInput, UsuarioAlmacenUncheckedCreateInput>
    /**
     * In case the UsuarioAlmacen was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioAlmacenUpdateInput, UsuarioAlmacenUncheckedUpdateInput>
  }

  /**
   * UsuarioAlmacen delete
   */
  export type UsuarioAlmacenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
    /**
     * Filter which UsuarioAlmacen to delete.
     */
    where: UsuarioAlmacenWhereUniqueInput
  }

  /**
   * UsuarioAlmacen deleteMany
   */
  export type UsuarioAlmacenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsuarioAlmacens to delete
     */
    where?: UsuarioAlmacenWhereInput
    /**
     * Limit how many UsuarioAlmacens to delete.
     */
    limit?: number
  }

  /**
   * UsuarioAlmacen without action
   */
  export type UsuarioAlmacenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioAlmacen
     */
    select?: UsuarioAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioAlmacen
     */
    omit?: UsuarioAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioAlmacenInclude<ExtArgs> | null
  }


  /**
   * Model CodigoAlmacen
   */

  export type AggregateCodigoAlmacen = {
    _count: CodigoAlmacenCountAggregateOutputType | null
    _avg: CodigoAlmacenAvgAggregateOutputType | null
    _sum: CodigoAlmacenSumAggregateOutputType | null
    _min: CodigoAlmacenMinAggregateOutputType | null
    _max: CodigoAlmacenMaxAggregateOutputType | null
  }

  export type CodigoAlmacenAvgAggregateOutputType = {
    id: number | null
    almacenId: number | null
    usosDisponibles: number | null
    creadoPorId: number | null
  }

  export type CodigoAlmacenSumAggregateOutputType = {
    id: number | null
    almacenId: number | null
    usosDisponibles: number | null
    creadoPorId: number | null
  }

  export type CodigoAlmacenMinAggregateOutputType = {
    id: number | null
    almacenId: number | null
    codigo: string | null
    rolAsignado: string | null
    permisos: string | null
    usosDisponibles: number | null
    activo: boolean | null
    fechaCreacion: Date | null
    fechaExpiracion: Date | null
    creadoPorId: number | null
  }

  export type CodigoAlmacenMaxAggregateOutputType = {
    id: number | null
    almacenId: number | null
    codigo: string | null
    rolAsignado: string | null
    permisos: string | null
    usosDisponibles: number | null
    activo: boolean | null
    fechaCreacion: Date | null
    fechaExpiracion: Date | null
    creadoPorId: number | null
  }

  export type CodigoAlmacenCountAggregateOutputType = {
    id: number
    almacenId: number
    codigo: number
    rolAsignado: number
    permisos: number
    usosDisponibles: number
    activo: number
    fechaCreacion: number
    fechaExpiracion: number
    creadoPorId: number
    _all: number
  }


  export type CodigoAlmacenAvgAggregateInputType = {
    id?: true
    almacenId?: true
    usosDisponibles?: true
    creadoPorId?: true
  }

  export type CodigoAlmacenSumAggregateInputType = {
    id?: true
    almacenId?: true
    usosDisponibles?: true
    creadoPorId?: true
  }

  export type CodigoAlmacenMinAggregateInputType = {
    id?: true
    almacenId?: true
    codigo?: true
    rolAsignado?: true
    permisos?: true
    usosDisponibles?: true
    activo?: true
    fechaCreacion?: true
    fechaExpiracion?: true
    creadoPorId?: true
  }

  export type CodigoAlmacenMaxAggregateInputType = {
    id?: true
    almacenId?: true
    codigo?: true
    rolAsignado?: true
    permisos?: true
    usosDisponibles?: true
    activo?: true
    fechaCreacion?: true
    fechaExpiracion?: true
    creadoPorId?: true
  }

  export type CodigoAlmacenCountAggregateInputType = {
    id?: true
    almacenId?: true
    codigo?: true
    rolAsignado?: true
    permisos?: true
    usosDisponibles?: true
    activo?: true
    fechaCreacion?: true
    fechaExpiracion?: true
    creadoPorId?: true
    _all?: true
  }

  export type CodigoAlmacenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodigoAlmacen to aggregate.
     */
    where?: CodigoAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoAlmacens to fetch.
     */
    orderBy?: CodigoAlmacenOrderByWithRelationInput | CodigoAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CodigoAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoAlmacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CodigoAlmacens
    **/
    _count?: true | CodigoAlmacenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CodigoAlmacenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CodigoAlmacenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CodigoAlmacenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CodigoAlmacenMaxAggregateInputType
  }

  export type GetCodigoAlmacenAggregateType<T extends CodigoAlmacenAggregateArgs> = {
        [P in keyof T & keyof AggregateCodigoAlmacen]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCodigoAlmacen[P]>
      : GetScalarType<T[P], AggregateCodigoAlmacen[P]>
  }




  export type CodigoAlmacenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodigoAlmacenWhereInput
    orderBy?: CodigoAlmacenOrderByWithAggregationInput | CodigoAlmacenOrderByWithAggregationInput[]
    by: CodigoAlmacenScalarFieldEnum[] | CodigoAlmacenScalarFieldEnum
    having?: CodigoAlmacenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CodigoAlmacenCountAggregateInputType | true
    _avg?: CodigoAlmacenAvgAggregateInputType
    _sum?: CodigoAlmacenSumAggregateInputType
    _min?: CodigoAlmacenMinAggregateInputType
    _max?: CodigoAlmacenMaxAggregateInputType
  }

  export type CodigoAlmacenGroupByOutputType = {
    id: number
    almacenId: number
    codigo: string
    rolAsignado: string
    permisos: string | null
    usosDisponibles: number | null
    activo: boolean
    fechaCreacion: Date
    fechaExpiracion: Date | null
    creadoPorId: number | null
    _count: CodigoAlmacenCountAggregateOutputType | null
    _avg: CodigoAlmacenAvgAggregateOutputType | null
    _sum: CodigoAlmacenSumAggregateOutputType | null
    _min: CodigoAlmacenMinAggregateOutputType | null
    _max: CodigoAlmacenMaxAggregateOutputType | null
  }

  type GetCodigoAlmacenGroupByPayload<T extends CodigoAlmacenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CodigoAlmacenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CodigoAlmacenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CodigoAlmacenGroupByOutputType[P]>
            : GetScalarType<T[P], CodigoAlmacenGroupByOutputType[P]>
        }
      >
    >


  export type CodigoAlmacenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    almacenId?: boolean
    codigo?: boolean
    rolAsignado?: boolean
    permisos?: boolean
    usosDisponibles?: boolean
    activo?: boolean
    fechaCreacion?: boolean
    fechaExpiracion?: boolean
    creadoPorId?: boolean
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codigoAlmacen"]>

  export type CodigoAlmacenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    almacenId?: boolean
    codigo?: boolean
    rolAsignado?: boolean
    permisos?: boolean
    usosDisponibles?: boolean
    activo?: boolean
    fechaCreacion?: boolean
    fechaExpiracion?: boolean
    creadoPorId?: boolean
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codigoAlmacen"]>

  export type CodigoAlmacenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    almacenId?: boolean
    codigo?: boolean
    rolAsignado?: boolean
    permisos?: boolean
    usosDisponibles?: boolean
    activo?: boolean
    fechaCreacion?: boolean
    fechaExpiracion?: boolean
    creadoPorId?: boolean
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codigoAlmacen"]>

  export type CodigoAlmacenSelectScalar = {
    id?: boolean
    almacenId?: boolean
    codigo?: boolean
    rolAsignado?: boolean
    permisos?: boolean
    usosDisponibles?: boolean
    activo?: boolean
    fechaCreacion?: boolean
    fechaExpiracion?: boolean
    creadoPorId?: boolean
  }

  export type CodigoAlmacenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "almacenId" | "codigo" | "rolAsignado" | "permisos" | "usosDisponibles" | "activo" | "fechaCreacion" | "fechaExpiracion" | "creadoPorId", ExtArgs["result"]["codigoAlmacen"]>
  export type CodigoAlmacenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }
  export type CodigoAlmacenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }
  export type CodigoAlmacenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    almacen?: boolean | AlmacenDefaultArgs<ExtArgs>
  }

  export type $CodigoAlmacenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CodigoAlmacen"
    objects: {
      almacen: Prisma.$AlmacenPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      almacenId: number
      codigo: string
      rolAsignado: string
      permisos: string | null
      usosDisponibles: number | null
      activo: boolean
      fechaCreacion: Date
      fechaExpiracion: Date | null
      creadoPorId: number | null
    }, ExtArgs["result"]["codigoAlmacen"]>
    composites: {}
  }

  type CodigoAlmacenGetPayload<S extends boolean | null | undefined | CodigoAlmacenDefaultArgs> = $Result.GetResult<Prisma.$CodigoAlmacenPayload, S>

  type CodigoAlmacenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CodigoAlmacenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CodigoAlmacenCountAggregateInputType | true
    }

  export interface CodigoAlmacenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CodigoAlmacen'], meta: { name: 'CodigoAlmacen' } }
    /**
     * Find zero or one CodigoAlmacen that matches the filter.
     * @param {CodigoAlmacenFindUniqueArgs} args - Arguments to find a CodigoAlmacen
     * @example
     * // Get one CodigoAlmacen
     * const codigoAlmacen = await prisma.codigoAlmacen.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CodigoAlmacenFindUniqueArgs>(args: SelectSubset<T, CodigoAlmacenFindUniqueArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CodigoAlmacen that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CodigoAlmacenFindUniqueOrThrowArgs} args - Arguments to find a CodigoAlmacen
     * @example
     * // Get one CodigoAlmacen
     * const codigoAlmacen = await prisma.codigoAlmacen.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CodigoAlmacenFindUniqueOrThrowArgs>(args: SelectSubset<T, CodigoAlmacenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CodigoAlmacen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoAlmacenFindFirstArgs} args - Arguments to find a CodigoAlmacen
     * @example
     * // Get one CodigoAlmacen
     * const codigoAlmacen = await prisma.codigoAlmacen.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CodigoAlmacenFindFirstArgs>(args?: SelectSubset<T, CodigoAlmacenFindFirstArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CodigoAlmacen that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoAlmacenFindFirstOrThrowArgs} args - Arguments to find a CodigoAlmacen
     * @example
     * // Get one CodigoAlmacen
     * const codigoAlmacen = await prisma.codigoAlmacen.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CodigoAlmacenFindFirstOrThrowArgs>(args?: SelectSubset<T, CodigoAlmacenFindFirstOrThrowArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CodigoAlmacens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoAlmacenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CodigoAlmacens
     * const codigoAlmacens = await prisma.codigoAlmacen.findMany()
     * 
     * // Get first 10 CodigoAlmacens
     * const codigoAlmacens = await prisma.codigoAlmacen.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const codigoAlmacenWithIdOnly = await prisma.codigoAlmacen.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CodigoAlmacenFindManyArgs>(args?: SelectSubset<T, CodigoAlmacenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CodigoAlmacen.
     * @param {CodigoAlmacenCreateArgs} args - Arguments to create a CodigoAlmacen.
     * @example
     * // Create one CodigoAlmacen
     * const CodigoAlmacen = await prisma.codigoAlmacen.create({
     *   data: {
     *     // ... data to create a CodigoAlmacen
     *   }
     * })
     * 
     */
    create<T extends CodigoAlmacenCreateArgs>(args: SelectSubset<T, CodigoAlmacenCreateArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CodigoAlmacens.
     * @param {CodigoAlmacenCreateManyArgs} args - Arguments to create many CodigoAlmacens.
     * @example
     * // Create many CodigoAlmacens
     * const codigoAlmacen = await prisma.codigoAlmacen.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CodigoAlmacenCreateManyArgs>(args?: SelectSubset<T, CodigoAlmacenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CodigoAlmacens and returns the data saved in the database.
     * @param {CodigoAlmacenCreateManyAndReturnArgs} args - Arguments to create many CodigoAlmacens.
     * @example
     * // Create many CodigoAlmacens
     * const codigoAlmacen = await prisma.codigoAlmacen.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CodigoAlmacens and only return the `id`
     * const codigoAlmacenWithIdOnly = await prisma.codigoAlmacen.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CodigoAlmacenCreateManyAndReturnArgs>(args?: SelectSubset<T, CodigoAlmacenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CodigoAlmacen.
     * @param {CodigoAlmacenDeleteArgs} args - Arguments to delete one CodigoAlmacen.
     * @example
     * // Delete one CodigoAlmacen
     * const CodigoAlmacen = await prisma.codigoAlmacen.delete({
     *   where: {
     *     // ... filter to delete one CodigoAlmacen
     *   }
     * })
     * 
     */
    delete<T extends CodigoAlmacenDeleteArgs>(args: SelectSubset<T, CodigoAlmacenDeleteArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CodigoAlmacen.
     * @param {CodigoAlmacenUpdateArgs} args - Arguments to update one CodigoAlmacen.
     * @example
     * // Update one CodigoAlmacen
     * const codigoAlmacen = await prisma.codigoAlmacen.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CodigoAlmacenUpdateArgs>(args: SelectSubset<T, CodigoAlmacenUpdateArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CodigoAlmacens.
     * @param {CodigoAlmacenDeleteManyArgs} args - Arguments to filter CodigoAlmacens to delete.
     * @example
     * // Delete a few CodigoAlmacens
     * const { count } = await prisma.codigoAlmacen.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CodigoAlmacenDeleteManyArgs>(args?: SelectSubset<T, CodigoAlmacenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CodigoAlmacens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoAlmacenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CodigoAlmacens
     * const codigoAlmacen = await prisma.codigoAlmacen.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CodigoAlmacenUpdateManyArgs>(args: SelectSubset<T, CodigoAlmacenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CodigoAlmacens and returns the data updated in the database.
     * @param {CodigoAlmacenUpdateManyAndReturnArgs} args - Arguments to update many CodigoAlmacens.
     * @example
     * // Update many CodigoAlmacens
     * const codigoAlmacen = await prisma.codigoAlmacen.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CodigoAlmacens and only return the `id`
     * const codigoAlmacenWithIdOnly = await prisma.codigoAlmacen.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CodigoAlmacenUpdateManyAndReturnArgs>(args: SelectSubset<T, CodigoAlmacenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CodigoAlmacen.
     * @param {CodigoAlmacenUpsertArgs} args - Arguments to update or create a CodigoAlmacen.
     * @example
     * // Update or create a CodigoAlmacen
     * const codigoAlmacen = await prisma.codigoAlmacen.upsert({
     *   create: {
     *     // ... data to create a CodigoAlmacen
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CodigoAlmacen we want to update
     *   }
     * })
     */
    upsert<T extends CodigoAlmacenUpsertArgs>(args: SelectSubset<T, CodigoAlmacenUpsertArgs<ExtArgs>>): Prisma__CodigoAlmacenClient<$Result.GetResult<Prisma.$CodigoAlmacenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CodigoAlmacens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoAlmacenCountArgs} args - Arguments to filter CodigoAlmacens to count.
     * @example
     * // Count the number of CodigoAlmacens
     * const count = await prisma.codigoAlmacen.count({
     *   where: {
     *     // ... the filter for the CodigoAlmacens we want to count
     *   }
     * })
    **/
    count<T extends CodigoAlmacenCountArgs>(
      args?: Subset<T, CodigoAlmacenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CodigoAlmacenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CodigoAlmacen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoAlmacenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CodigoAlmacenAggregateArgs>(args: Subset<T, CodigoAlmacenAggregateArgs>): Prisma.PrismaPromise<GetCodigoAlmacenAggregateType<T>>

    /**
     * Group by CodigoAlmacen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoAlmacenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CodigoAlmacenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CodigoAlmacenGroupByArgs['orderBy'] }
        : { orderBy?: CodigoAlmacenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CodigoAlmacenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCodigoAlmacenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CodigoAlmacen model
   */
  readonly fields: CodigoAlmacenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CodigoAlmacen.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CodigoAlmacenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    almacen<T extends AlmacenDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlmacenDefaultArgs<ExtArgs>>): Prisma__AlmacenClient<$Result.GetResult<Prisma.$AlmacenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CodigoAlmacen model
   */
  interface CodigoAlmacenFieldRefs {
    readonly id: FieldRef<"CodigoAlmacen", 'Int'>
    readonly almacenId: FieldRef<"CodigoAlmacen", 'Int'>
    readonly codigo: FieldRef<"CodigoAlmacen", 'String'>
    readonly rolAsignado: FieldRef<"CodigoAlmacen", 'String'>
    readonly permisos: FieldRef<"CodigoAlmacen", 'String'>
    readonly usosDisponibles: FieldRef<"CodigoAlmacen", 'Int'>
    readonly activo: FieldRef<"CodigoAlmacen", 'Boolean'>
    readonly fechaCreacion: FieldRef<"CodigoAlmacen", 'DateTime'>
    readonly fechaExpiracion: FieldRef<"CodigoAlmacen", 'DateTime'>
    readonly creadoPorId: FieldRef<"CodigoAlmacen", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * CodigoAlmacen findUnique
   */
  export type CodigoAlmacenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which CodigoAlmacen to fetch.
     */
    where: CodigoAlmacenWhereUniqueInput
  }

  /**
   * CodigoAlmacen findUniqueOrThrow
   */
  export type CodigoAlmacenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which CodigoAlmacen to fetch.
     */
    where: CodigoAlmacenWhereUniqueInput
  }

  /**
   * CodigoAlmacen findFirst
   */
  export type CodigoAlmacenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which CodigoAlmacen to fetch.
     */
    where?: CodigoAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoAlmacens to fetch.
     */
    orderBy?: CodigoAlmacenOrderByWithRelationInput | CodigoAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodigoAlmacens.
     */
    cursor?: CodigoAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoAlmacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodigoAlmacens.
     */
    distinct?: CodigoAlmacenScalarFieldEnum | CodigoAlmacenScalarFieldEnum[]
  }

  /**
   * CodigoAlmacen findFirstOrThrow
   */
  export type CodigoAlmacenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which CodigoAlmacen to fetch.
     */
    where?: CodigoAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoAlmacens to fetch.
     */
    orderBy?: CodigoAlmacenOrderByWithRelationInput | CodigoAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodigoAlmacens.
     */
    cursor?: CodigoAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoAlmacens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodigoAlmacens.
     */
    distinct?: CodigoAlmacenScalarFieldEnum | CodigoAlmacenScalarFieldEnum[]
  }

  /**
   * CodigoAlmacen findMany
   */
  export type CodigoAlmacenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * Filter, which CodigoAlmacens to fetch.
     */
    where?: CodigoAlmacenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoAlmacens to fetch.
     */
    orderBy?: CodigoAlmacenOrderByWithRelationInput | CodigoAlmacenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CodigoAlmacens.
     */
    cursor?: CodigoAlmacenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoAlmacens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoAlmacens.
     */
    skip?: number
    distinct?: CodigoAlmacenScalarFieldEnum | CodigoAlmacenScalarFieldEnum[]
  }

  /**
   * CodigoAlmacen create
   */
  export type CodigoAlmacenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * The data needed to create a CodigoAlmacen.
     */
    data: XOR<CodigoAlmacenCreateInput, CodigoAlmacenUncheckedCreateInput>
  }

  /**
   * CodigoAlmacen createMany
   */
  export type CodigoAlmacenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CodigoAlmacens.
     */
    data: CodigoAlmacenCreateManyInput | CodigoAlmacenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CodigoAlmacen createManyAndReturn
   */
  export type CodigoAlmacenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * The data used to create many CodigoAlmacens.
     */
    data: CodigoAlmacenCreateManyInput | CodigoAlmacenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CodigoAlmacen update
   */
  export type CodigoAlmacenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * The data needed to update a CodigoAlmacen.
     */
    data: XOR<CodigoAlmacenUpdateInput, CodigoAlmacenUncheckedUpdateInput>
    /**
     * Choose, which CodigoAlmacen to update.
     */
    where: CodigoAlmacenWhereUniqueInput
  }

  /**
   * CodigoAlmacen updateMany
   */
  export type CodigoAlmacenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CodigoAlmacens.
     */
    data: XOR<CodigoAlmacenUpdateManyMutationInput, CodigoAlmacenUncheckedUpdateManyInput>
    /**
     * Filter which CodigoAlmacens to update
     */
    where?: CodigoAlmacenWhereInput
    /**
     * Limit how many CodigoAlmacens to update.
     */
    limit?: number
  }

  /**
   * CodigoAlmacen updateManyAndReturn
   */
  export type CodigoAlmacenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * The data used to update CodigoAlmacens.
     */
    data: XOR<CodigoAlmacenUpdateManyMutationInput, CodigoAlmacenUncheckedUpdateManyInput>
    /**
     * Filter which CodigoAlmacens to update
     */
    where?: CodigoAlmacenWhereInput
    /**
     * Limit how many CodigoAlmacens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CodigoAlmacen upsert
   */
  export type CodigoAlmacenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * The filter to search for the CodigoAlmacen to update in case it exists.
     */
    where: CodigoAlmacenWhereUniqueInput
    /**
     * In case the CodigoAlmacen found by the `where` argument doesn't exist, create a new CodigoAlmacen with this data.
     */
    create: XOR<CodigoAlmacenCreateInput, CodigoAlmacenUncheckedCreateInput>
    /**
     * In case the CodigoAlmacen was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CodigoAlmacenUpdateInput, CodigoAlmacenUncheckedUpdateInput>
  }

  /**
   * CodigoAlmacen delete
   */
  export type CodigoAlmacenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
    /**
     * Filter which CodigoAlmacen to delete.
     */
    where: CodigoAlmacenWhereUniqueInput
  }

  /**
   * CodigoAlmacen deleteMany
   */
  export type CodigoAlmacenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodigoAlmacens to delete
     */
    where?: CodigoAlmacenWhereInput
    /**
     * Limit how many CodigoAlmacens to delete.
     */
    limit?: number
  }

  /**
   * CodigoAlmacen without action
   */
  export type CodigoAlmacenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoAlmacen
     */
    select?: CodigoAlmacenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodigoAlmacen
     */
    omit?: CodigoAlmacenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoAlmacenInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EntidadScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    tipo: 'tipo',
    correoContacto: 'correoContacto',
    telefono: 'telefono',
    direccion: 'direccion',
    fechaCreacion: 'fechaCreacion'
  };

  export type EntidadScalarFieldEnum = (typeof EntidadScalarFieldEnum)[keyof typeof EntidadScalarFieldEnum]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    apellidos: 'apellidos',
    correo: 'correo',
    contrasena: 'contrasena',
    googleId: 'googleId',
    tipoCuenta: 'tipoCuenta',
    estado: 'estado',
    fechaRegistro: 'fechaRegistro',
    entidadId: 'entidadId',
    codigoUsado: 'codigoUsado',
    archivoNombre: 'archivoNombre',
    archivoBuffer: 'archivoBuffer'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const RolScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    descripcion: 'descripcion',
    permisos: 'permisos',
    entidadId: 'entidadId'
  };

  export type RolScalarFieldEnum = (typeof RolScalarFieldEnum)[keyof typeof RolScalarFieldEnum]


  export const AlmacenScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    descripcion: 'descripcion',
    imagenUrl: 'imagenUrl',
    codigoUnico: 'codigoUnico',
    funciones: 'funciones',
    permisosPredeterminados: 'permisosPredeterminados',
    fechaCreacion: 'fechaCreacion',
    entidadId: 'entidadId'
  };

  export type AlmacenScalarFieldEnum = (typeof AlmacenScalarFieldEnum)[keyof typeof AlmacenScalarFieldEnum]


  export const UsuarioAlmacenScalarFieldEnum: {
    id: 'id',
    usuarioId: 'usuarioId',
    almacenId: 'almacenId',
    rolEnAlmacen: 'rolEnAlmacen',
    permisosExtra: 'permisosExtra'
  };

  export type UsuarioAlmacenScalarFieldEnum = (typeof UsuarioAlmacenScalarFieldEnum)[keyof typeof UsuarioAlmacenScalarFieldEnum]


  export const CodigoAlmacenScalarFieldEnum: {
    id: 'id',
    almacenId: 'almacenId',
    codigo: 'codigo',
    rolAsignado: 'rolAsignado',
    permisos: 'permisos',
    usosDisponibles: 'usosDisponibles',
    activo: 'activo',
    fechaCreacion: 'fechaCreacion',
    fechaExpiracion: 'fechaExpiracion',
    creadoPorId: 'creadoPorId'
  };

  export type CodigoAlmacenScalarFieldEnum = (typeof CodigoAlmacenScalarFieldEnum)[keyof typeof CodigoAlmacenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type EntidadWhereInput = {
    AND?: EntidadWhereInput | EntidadWhereInput[]
    OR?: EntidadWhereInput[]
    NOT?: EntidadWhereInput | EntidadWhereInput[]
    id?: IntFilter<"Entidad"> | number
    nombre?: StringFilter<"Entidad"> | string
    tipo?: StringFilter<"Entidad"> | string
    correoContacto?: StringFilter<"Entidad"> | string
    telefono?: StringNullableFilter<"Entidad"> | string | null
    direccion?: StringNullableFilter<"Entidad"> | string | null
    fechaCreacion?: DateTimeFilter<"Entidad"> | Date | string
    usuarios?: UsuarioListRelationFilter
    almacenes?: AlmacenListRelationFilter
    roles?: RolListRelationFilter
  }

  export type EntidadOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    tipo?: SortOrder
    correoContacto?: SortOrder
    telefono?: SortOrderInput | SortOrder
    direccion?: SortOrderInput | SortOrder
    fechaCreacion?: SortOrder
    usuarios?: UsuarioOrderByRelationAggregateInput
    almacenes?: AlmacenOrderByRelationAggregateInput
    roles?: RolOrderByRelationAggregateInput
  }

  export type EntidadWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EntidadWhereInput | EntidadWhereInput[]
    OR?: EntidadWhereInput[]
    NOT?: EntidadWhereInput | EntidadWhereInput[]
    nombre?: StringFilter<"Entidad"> | string
    tipo?: StringFilter<"Entidad"> | string
    correoContacto?: StringFilter<"Entidad"> | string
    telefono?: StringNullableFilter<"Entidad"> | string | null
    direccion?: StringNullableFilter<"Entidad"> | string | null
    fechaCreacion?: DateTimeFilter<"Entidad"> | Date | string
    usuarios?: UsuarioListRelationFilter
    almacenes?: AlmacenListRelationFilter
    roles?: RolListRelationFilter
  }, "id">

  export type EntidadOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    tipo?: SortOrder
    correoContacto?: SortOrder
    telefono?: SortOrderInput | SortOrder
    direccion?: SortOrderInput | SortOrder
    fechaCreacion?: SortOrder
    _count?: EntidadCountOrderByAggregateInput
    _avg?: EntidadAvgOrderByAggregateInput
    _max?: EntidadMaxOrderByAggregateInput
    _min?: EntidadMinOrderByAggregateInput
    _sum?: EntidadSumOrderByAggregateInput
  }

  export type EntidadScalarWhereWithAggregatesInput = {
    AND?: EntidadScalarWhereWithAggregatesInput | EntidadScalarWhereWithAggregatesInput[]
    OR?: EntidadScalarWhereWithAggregatesInput[]
    NOT?: EntidadScalarWhereWithAggregatesInput | EntidadScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Entidad"> | number
    nombre?: StringWithAggregatesFilter<"Entidad"> | string
    tipo?: StringWithAggregatesFilter<"Entidad"> | string
    correoContacto?: StringWithAggregatesFilter<"Entidad"> | string
    telefono?: StringNullableWithAggregatesFilter<"Entidad"> | string | null
    direccion?: StringNullableWithAggregatesFilter<"Entidad"> | string | null
    fechaCreacion?: DateTimeWithAggregatesFilter<"Entidad"> | Date | string
  }

  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: IntFilter<"Usuario"> | number
    nombre?: StringFilter<"Usuario"> | string
    apellidos?: StringFilter<"Usuario"> | string
    correo?: StringFilter<"Usuario"> | string
    contrasena?: StringFilter<"Usuario"> | string
    googleId?: StringNullableFilter<"Usuario"> | string | null
    tipoCuenta?: StringFilter<"Usuario"> | string
    estado?: StringFilter<"Usuario"> | string
    fechaRegistro?: DateTimeFilter<"Usuario"> | Date | string
    entidadId?: IntNullableFilter<"Usuario"> | number | null
    codigoUsado?: StringNullableFilter<"Usuario"> | string | null
    archivoNombre?: StringNullableFilter<"Usuario"> | string | null
    archivoBuffer?: BytesNullableFilter<"Usuario"> | Uint8Array | null
    entidad?: XOR<EntidadNullableScalarRelationFilter, EntidadWhereInput> | null
    roles?: RolListRelationFilter
    almacenes?: UsuarioAlmacenListRelationFilter
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    contrasena?: SortOrder
    googleId?: SortOrderInput | SortOrder
    tipoCuenta?: SortOrder
    estado?: SortOrder
    fechaRegistro?: SortOrder
    entidadId?: SortOrderInput | SortOrder
    codigoUsado?: SortOrderInput | SortOrder
    archivoNombre?: SortOrderInput | SortOrder
    archivoBuffer?: SortOrderInput | SortOrder
    entidad?: EntidadOrderByWithRelationInput
    roles?: RolOrderByRelationAggregateInput
    almacenes?: UsuarioAlmacenOrderByRelationAggregateInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    correo?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nombre?: StringFilter<"Usuario"> | string
    apellidos?: StringFilter<"Usuario"> | string
    contrasena?: StringFilter<"Usuario"> | string
    googleId?: StringNullableFilter<"Usuario"> | string | null
    tipoCuenta?: StringFilter<"Usuario"> | string
    estado?: StringFilter<"Usuario"> | string
    fechaRegistro?: DateTimeFilter<"Usuario"> | Date | string
    entidadId?: IntNullableFilter<"Usuario"> | number | null
    codigoUsado?: StringNullableFilter<"Usuario"> | string | null
    archivoNombre?: StringNullableFilter<"Usuario"> | string | null
    archivoBuffer?: BytesNullableFilter<"Usuario"> | Uint8Array | null
    entidad?: XOR<EntidadNullableScalarRelationFilter, EntidadWhereInput> | null
    roles?: RolListRelationFilter
    almacenes?: UsuarioAlmacenListRelationFilter
  }, "id" | "correo">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    contrasena?: SortOrder
    googleId?: SortOrderInput | SortOrder
    tipoCuenta?: SortOrder
    estado?: SortOrder
    fechaRegistro?: SortOrder
    entidadId?: SortOrderInput | SortOrder
    codigoUsado?: SortOrderInput | SortOrder
    archivoNombre?: SortOrderInput | SortOrder
    archivoBuffer?: SortOrderInput | SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Usuario"> | number
    nombre?: StringWithAggregatesFilter<"Usuario"> | string
    apellidos?: StringWithAggregatesFilter<"Usuario"> | string
    correo?: StringWithAggregatesFilter<"Usuario"> | string
    contrasena?: StringWithAggregatesFilter<"Usuario"> | string
    googleId?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    tipoCuenta?: StringWithAggregatesFilter<"Usuario"> | string
    estado?: StringWithAggregatesFilter<"Usuario"> | string
    fechaRegistro?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
    entidadId?: IntNullableWithAggregatesFilter<"Usuario"> | number | null
    codigoUsado?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    archivoNombre?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    archivoBuffer?: BytesNullableWithAggregatesFilter<"Usuario"> | Uint8Array | null
  }

  export type RolWhereInput = {
    AND?: RolWhereInput | RolWhereInput[]
    OR?: RolWhereInput[]
    NOT?: RolWhereInput | RolWhereInput[]
    id?: IntFilter<"Rol"> | number
    nombre?: StringFilter<"Rol"> | string
    descripcion?: StringNullableFilter<"Rol"> | string | null
    permisos?: StringFilter<"Rol"> | string
    entidadId?: IntNullableFilter<"Rol"> | number | null
    entidad?: XOR<EntidadNullableScalarRelationFilter, EntidadWhereInput> | null
    usuarios?: UsuarioListRelationFilter
  }

  export type RolOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    permisos?: SortOrder
    entidadId?: SortOrderInput | SortOrder
    entidad?: EntidadOrderByWithRelationInput
    usuarios?: UsuarioOrderByRelationAggregateInput
  }

  export type RolWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RolWhereInput | RolWhereInput[]
    OR?: RolWhereInput[]
    NOT?: RolWhereInput | RolWhereInput[]
    nombre?: StringFilter<"Rol"> | string
    descripcion?: StringNullableFilter<"Rol"> | string | null
    permisos?: StringFilter<"Rol"> | string
    entidadId?: IntNullableFilter<"Rol"> | number | null
    entidad?: XOR<EntidadNullableScalarRelationFilter, EntidadWhereInput> | null
    usuarios?: UsuarioListRelationFilter
  }, "id">

  export type RolOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    permisos?: SortOrder
    entidadId?: SortOrderInput | SortOrder
    _count?: RolCountOrderByAggregateInput
    _avg?: RolAvgOrderByAggregateInput
    _max?: RolMaxOrderByAggregateInput
    _min?: RolMinOrderByAggregateInput
    _sum?: RolSumOrderByAggregateInput
  }

  export type RolScalarWhereWithAggregatesInput = {
    AND?: RolScalarWhereWithAggregatesInput | RolScalarWhereWithAggregatesInput[]
    OR?: RolScalarWhereWithAggregatesInput[]
    NOT?: RolScalarWhereWithAggregatesInput | RolScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Rol"> | number
    nombre?: StringWithAggregatesFilter<"Rol"> | string
    descripcion?: StringNullableWithAggregatesFilter<"Rol"> | string | null
    permisos?: StringWithAggregatesFilter<"Rol"> | string
    entidadId?: IntNullableWithAggregatesFilter<"Rol"> | number | null
  }

  export type AlmacenWhereInput = {
    AND?: AlmacenWhereInput | AlmacenWhereInput[]
    OR?: AlmacenWhereInput[]
    NOT?: AlmacenWhereInput | AlmacenWhereInput[]
    id?: IntFilter<"Almacen"> | number
    nombre?: StringFilter<"Almacen"> | string
    descripcion?: StringNullableFilter<"Almacen"> | string | null
    imagenUrl?: StringNullableFilter<"Almacen"> | string | null
    codigoUnico?: StringFilter<"Almacen"> | string
    funciones?: StringNullableFilter<"Almacen"> | string | null
    permisosPredeterminados?: StringNullableFilter<"Almacen"> | string | null
    fechaCreacion?: DateTimeFilter<"Almacen"> | Date | string
    entidadId?: IntFilter<"Almacen"> | number
    entidad?: XOR<EntidadScalarRelationFilter, EntidadWhereInput>
    usuarios?: UsuarioAlmacenListRelationFilter
    codigos?: CodigoAlmacenListRelationFilter
  }

  export type AlmacenOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    imagenUrl?: SortOrderInput | SortOrder
    codigoUnico?: SortOrder
    funciones?: SortOrderInput | SortOrder
    permisosPredeterminados?: SortOrderInput | SortOrder
    fechaCreacion?: SortOrder
    entidadId?: SortOrder
    entidad?: EntidadOrderByWithRelationInput
    usuarios?: UsuarioAlmacenOrderByRelationAggregateInput
    codigos?: CodigoAlmacenOrderByRelationAggregateInput
  }

  export type AlmacenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    codigoUnico?: string
    AND?: AlmacenWhereInput | AlmacenWhereInput[]
    OR?: AlmacenWhereInput[]
    NOT?: AlmacenWhereInput | AlmacenWhereInput[]
    nombre?: StringFilter<"Almacen"> | string
    descripcion?: StringNullableFilter<"Almacen"> | string | null
    imagenUrl?: StringNullableFilter<"Almacen"> | string | null
    funciones?: StringNullableFilter<"Almacen"> | string | null
    permisosPredeterminados?: StringNullableFilter<"Almacen"> | string | null
    fechaCreacion?: DateTimeFilter<"Almacen"> | Date | string
    entidadId?: IntFilter<"Almacen"> | number
    entidad?: XOR<EntidadScalarRelationFilter, EntidadWhereInput>
    usuarios?: UsuarioAlmacenListRelationFilter
    codigos?: CodigoAlmacenListRelationFilter
  }, "id" | "codigoUnico">

  export type AlmacenOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    imagenUrl?: SortOrderInput | SortOrder
    codigoUnico?: SortOrder
    funciones?: SortOrderInput | SortOrder
    permisosPredeterminados?: SortOrderInput | SortOrder
    fechaCreacion?: SortOrder
    entidadId?: SortOrder
    _count?: AlmacenCountOrderByAggregateInput
    _avg?: AlmacenAvgOrderByAggregateInput
    _max?: AlmacenMaxOrderByAggregateInput
    _min?: AlmacenMinOrderByAggregateInput
    _sum?: AlmacenSumOrderByAggregateInput
  }

  export type AlmacenScalarWhereWithAggregatesInput = {
    AND?: AlmacenScalarWhereWithAggregatesInput | AlmacenScalarWhereWithAggregatesInput[]
    OR?: AlmacenScalarWhereWithAggregatesInput[]
    NOT?: AlmacenScalarWhereWithAggregatesInput | AlmacenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Almacen"> | number
    nombre?: StringWithAggregatesFilter<"Almacen"> | string
    descripcion?: StringNullableWithAggregatesFilter<"Almacen"> | string | null
    imagenUrl?: StringNullableWithAggregatesFilter<"Almacen"> | string | null
    codigoUnico?: StringWithAggregatesFilter<"Almacen"> | string
    funciones?: StringNullableWithAggregatesFilter<"Almacen"> | string | null
    permisosPredeterminados?: StringNullableWithAggregatesFilter<"Almacen"> | string | null
    fechaCreacion?: DateTimeWithAggregatesFilter<"Almacen"> | Date | string
    entidadId?: IntWithAggregatesFilter<"Almacen"> | number
  }

  export type UsuarioAlmacenWhereInput = {
    AND?: UsuarioAlmacenWhereInput | UsuarioAlmacenWhereInput[]
    OR?: UsuarioAlmacenWhereInput[]
    NOT?: UsuarioAlmacenWhereInput | UsuarioAlmacenWhereInput[]
    id?: IntFilter<"UsuarioAlmacen"> | number
    usuarioId?: IntFilter<"UsuarioAlmacen"> | number
    almacenId?: IntFilter<"UsuarioAlmacen"> | number
    rolEnAlmacen?: StringFilter<"UsuarioAlmacen"> | string
    permisosExtra?: StringNullableFilter<"UsuarioAlmacen"> | string | null
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    almacen?: XOR<AlmacenScalarRelationFilter, AlmacenWhereInput>
  }

  export type UsuarioAlmacenOrderByWithRelationInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    almacenId?: SortOrder
    rolEnAlmacen?: SortOrder
    permisosExtra?: SortOrderInput | SortOrder
    usuario?: UsuarioOrderByWithRelationInput
    almacen?: AlmacenOrderByWithRelationInput
  }

  export type UsuarioAlmacenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    usuarioId_almacenId?: UsuarioAlmacenUsuarioIdAlmacenIdCompoundUniqueInput
    AND?: UsuarioAlmacenWhereInput | UsuarioAlmacenWhereInput[]
    OR?: UsuarioAlmacenWhereInput[]
    NOT?: UsuarioAlmacenWhereInput | UsuarioAlmacenWhereInput[]
    usuarioId?: IntFilter<"UsuarioAlmacen"> | number
    almacenId?: IntFilter<"UsuarioAlmacen"> | number
    rolEnAlmacen?: StringFilter<"UsuarioAlmacen"> | string
    permisosExtra?: StringNullableFilter<"UsuarioAlmacen"> | string | null
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    almacen?: XOR<AlmacenScalarRelationFilter, AlmacenWhereInput>
  }, "id" | "usuarioId_almacenId">

  export type UsuarioAlmacenOrderByWithAggregationInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    almacenId?: SortOrder
    rolEnAlmacen?: SortOrder
    permisosExtra?: SortOrderInput | SortOrder
    _count?: UsuarioAlmacenCountOrderByAggregateInput
    _avg?: UsuarioAlmacenAvgOrderByAggregateInput
    _max?: UsuarioAlmacenMaxOrderByAggregateInput
    _min?: UsuarioAlmacenMinOrderByAggregateInput
    _sum?: UsuarioAlmacenSumOrderByAggregateInput
  }

  export type UsuarioAlmacenScalarWhereWithAggregatesInput = {
    AND?: UsuarioAlmacenScalarWhereWithAggregatesInput | UsuarioAlmacenScalarWhereWithAggregatesInput[]
    OR?: UsuarioAlmacenScalarWhereWithAggregatesInput[]
    NOT?: UsuarioAlmacenScalarWhereWithAggregatesInput | UsuarioAlmacenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UsuarioAlmacen"> | number
    usuarioId?: IntWithAggregatesFilter<"UsuarioAlmacen"> | number
    almacenId?: IntWithAggregatesFilter<"UsuarioAlmacen"> | number
    rolEnAlmacen?: StringWithAggregatesFilter<"UsuarioAlmacen"> | string
    permisosExtra?: StringNullableWithAggregatesFilter<"UsuarioAlmacen"> | string | null
  }

  export type CodigoAlmacenWhereInput = {
    AND?: CodigoAlmacenWhereInput | CodigoAlmacenWhereInput[]
    OR?: CodigoAlmacenWhereInput[]
    NOT?: CodigoAlmacenWhereInput | CodigoAlmacenWhereInput[]
    id?: IntFilter<"CodigoAlmacen"> | number
    almacenId?: IntFilter<"CodigoAlmacen"> | number
    codigo?: StringFilter<"CodigoAlmacen"> | string
    rolAsignado?: StringFilter<"CodigoAlmacen"> | string
    permisos?: StringNullableFilter<"CodigoAlmacen"> | string | null
    usosDisponibles?: IntNullableFilter<"CodigoAlmacen"> | number | null
    activo?: BoolFilter<"CodigoAlmacen"> | boolean
    fechaCreacion?: DateTimeFilter<"CodigoAlmacen"> | Date | string
    fechaExpiracion?: DateTimeNullableFilter<"CodigoAlmacen"> | Date | string | null
    creadoPorId?: IntNullableFilter<"CodigoAlmacen"> | number | null
    almacen?: XOR<AlmacenScalarRelationFilter, AlmacenWhereInput>
  }

  export type CodigoAlmacenOrderByWithRelationInput = {
    id?: SortOrder
    almacenId?: SortOrder
    codigo?: SortOrder
    rolAsignado?: SortOrder
    permisos?: SortOrderInput | SortOrder
    usosDisponibles?: SortOrderInput | SortOrder
    activo?: SortOrder
    fechaCreacion?: SortOrder
    fechaExpiracion?: SortOrderInput | SortOrder
    creadoPorId?: SortOrderInput | SortOrder
    almacen?: AlmacenOrderByWithRelationInput
  }

  export type CodigoAlmacenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    codigo?: string
    AND?: CodigoAlmacenWhereInput | CodigoAlmacenWhereInput[]
    OR?: CodigoAlmacenWhereInput[]
    NOT?: CodigoAlmacenWhereInput | CodigoAlmacenWhereInput[]
    almacenId?: IntFilter<"CodigoAlmacen"> | number
    rolAsignado?: StringFilter<"CodigoAlmacen"> | string
    permisos?: StringNullableFilter<"CodigoAlmacen"> | string | null
    usosDisponibles?: IntNullableFilter<"CodigoAlmacen"> | number | null
    activo?: BoolFilter<"CodigoAlmacen"> | boolean
    fechaCreacion?: DateTimeFilter<"CodigoAlmacen"> | Date | string
    fechaExpiracion?: DateTimeNullableFilter<"CodigoAlmacen"> | Date | string | null
    creadoPorId?: IntNullableFilter<"CodigoAlmacen"> | number | null
    almacen?: XOR<AlmacenScalarRelationFilter, AlmacenWhereInput>
  }, "id" | "codigo">

  export type CodigoAlmacenOrderByWithAggregationInput = {
    id?: SortOrder
    almacenId?: SortOrder
    codigo?: SortOrder
    rolAsignado?: SortOrder
    permisos?: SortOrderInput | SortOrder
    usosDisponibles?: SortOrderInput | SortOrder
    activo?: SortOrder
    fechaCreacion?: SortOrder
    fechaExpiracion?: SortOrderInput | SortOrder
    creadoPorId?: SortOrderInput | SortOrder
    _count?: CodigoAlmacenCountOrderByAggregateInput
    _avg?: CodigoAlmacenAvgOrderByAggregateInput
    _max?: CodigoAlmacenMaxOrderByAggregateInput
    _min?: CodigoAlmacenMinOrderByAggregateInput
    _sum?: CodigoAlmacenSumOrderByAggregateInput
  }

  export type CodigoAlmacenScalarWhereWithAggregatesInput = {
    AND?: CodigoAlmacenScalarWhereWithAggregatesInput | CodigoAlmacenScalarWhereWithAggregatesInput[]
    OR?: CodigoAlmacenScalarWhereWithAggregatesInput[]
    NOT?: CodigoAlmacenScalarWhereWithAggregatesInput | CodigoAlmacenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CodigoAlmacen"> | number
    almacenId?: IntWithAggregatesFilter<"CodigoAlmacen"> | number
    codigo?: StringWithAggregatesFilter<"CodigoAlmacen"> | string
    rolAsignado?: StringWithAggregatesFilter<"CodigoAlmacen"> | string
    permisos?: StringNullableWithAggregatesFilter<"CodigoAlmacen"> | string | null
    usosDisponibles?: IntNullableWithAggregatesFilter<"CodigoAlmacen"> | number | null
    activo?: BoolWithAggregatesFilter<"CodigoAlmacen"> | boolean
    fechaCreacion?: DateTimeWithAggregatesFilter<"CodigoAlmacen"> | Date | string
    fechaExpiracion?: DateTimeNullableWithAggregatesFilter<"CodigoAlmacen"> | Date | string | null
    creadoPorId?: IntNullableWithAggregatesFilter<"CodigoAlmacen"> | number | null
  }

  export type EntidadCreateInput = {
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioCreateNestedManyWithoutEntidadInput
    almacenes?: AlmacenCreateNestedManyWithoutEntidadInput
    roles?: RolCreateNestedManyWithoutEntidadInput
  }

  export type EntidadUncheckedCreateInput = {
    id?: number
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioUncheckedCreateNestedManyWithoutEntidadInput
    almacenes?: AlmacenUncheckedCreateNestedManyWithoutEntidadInput
    roles?: RolUncheckedCreateNestedManyWithoutEntidadInput
  }

  export type EntidadUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUpdateManyWithoutEntidadNestedInput
    almacenes?: AlmacenUpdateManyWithoutEntidadNestedInput
    roles?: RolUpdateManyWithoutEntidadNestedInput
  }

  export type EntidadUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUncheckedUpdateManyWithoutEntidadNestedInput
    almacenes?: AlmacenUncheckedUpdateManyWithoutEntidadNestedInput
    roles?: RolUncheckedUpdateManyWithoutEntidadNestedInput
  }

  export type EntidadCreateManyInput = {
    id?: number
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
  }

  export type EntidadUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntidadUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateInput = {
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    entidad?: EntidadCreateNestedOneWithoutUsuariosInput
    roles?: RolCreateNestedManyWithoutUsuariosInput
    almacenes?: UsuarioAlmacenCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateInput = {
    id?: number
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    entidadId?: number | null
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    roles?: RolUncheckedCreateNestedManyWithoutUsuariosInput
    almacenes?: UsuarioAlmacenUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    entidad?: EntidadUpdateOneWithoutUsuariosNestedInput
    roles?: RolUpdateManyWithoutUsuariosNestedInput
    almacenes?: UsuarioAlmacenUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    roles?: RolUncheckedUpdateManyWithoutUsuariosNestedInput
    almacenes?: UsuarioAlmacenUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioCreateManyInput = {
    id?: number
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    entidadId?: number | null
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
  }

  export type UsuarioUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type RolCreateInput = {
    nombre: string
    descripcion?: string | null
    permisos: string
    entidad?: EntidadCreateNestedOneWithoutRolesInput
    usuarios?: UsuarioCreateNestedManyWithoutRolesInput
  }

  export type RolUncheckedCreateInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    permisos: string
    entidadId?: number | null
    usuarios?: UsuarioUncheckedCreateNestedManyWithoutRolesInput
  }

  export type RolUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    entidad?: EntidadUpdateOneWithoutRolesNestedInput
    usuarios?: UsuarioUpdateManyWithoutRolesNestedInput
  }

  export type RolUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
    usuarios?: UsuarioUncheckedUpdateManyWithoutRolesNestedInput
  }

  export type RolCreateManyInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    permisos: string
    entidadId?: number | null
  }

  export type RolUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
  }

  export type RolUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AlmacenCreateInput = {
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    entidad: EntidadCreateNestedOneWithoutAlmacenesInput
    usuarios?: UsuarioAlmacenCreateNestedManyWithoutAlmacenInput
    codigos?: CodigoAlmacenCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenUncheckedCreateInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    entidadId: number
    usuarios?: UsuarioAlmacenUncheckedCreateNestedManyWithoutAlmacenInput
    codigos?: CodigoAlmacenUncheckedCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    entidad?: EntidadUpdateOneRequiredWithoutAlmacenesNestedInput
    usuarios?: UsuarioAlmacenUpdateManyWithoutAlmacenNestedInput
    codigos?: CodigoAlmacenUpdateManyWithoutAlmacenNestedInput
  }

  export type AlmacenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: IntFieldUpdateOperationsInput | number
    usuarios?: UsuarioAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput
    codigos?: CodigoAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput
  }

  export type AlmacenCreateManyInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    entidadId: number
  }

  export type AlmacenUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlmacenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: IntFieldUpdateOperationsInput | number
  }

  export type UsuarioAlmacenCreateInput = {
    rolEnAlmacen: string
    permisosExtra?: string | null
    usuario: UsuarioCreateNestedOneWithoutAlmacenesInput
    almacen: AlmacenCreateNestedOneWithoutUsuariosInput
  }

  export type UsuarioAlmacenUncheckedCreateInput = {
    id?: number
    usuarioId: number
    almacenId: number
    rolEnAlmacen: string
    permisosExtra?: string | null
  }

  export type UsuarioAlmacenUpdateInput = {
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
    usuario?: UsuarioUpdateOneRequiredWithoutAlmacenesNestedInput
    almacen?: AlmacenUpdateOneRequiredWithoutUsuariosNestedInput
  }

  export type UsuarioAlmacenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    almacenId?: IntFieldUpdateOperationsInput | number
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsuarioAlmacenCreateManyInput = {
    id?: number
    usuarioId: number
    almacenId: number
    rolEnAlmacen: string
    permisosExtra?: string | null
  }

  export type UsuarioAlmacenUpdateManyMutationInput = {
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsuarioAlmacenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    almacenId?: IntFieldUpdateOperationsInput | number
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CodigoAlmacenCreateInput = {
    codigo: string
    rolAsignado: string
    permisos?: string | null
    usosDisponibles?: number | null
    activo?: boolean
    fechaCreacion?: Date | string
    fechaExpiracion?: Date | string | null
    creadoPorId?: number | null
    almacen: AlmacenCreateNestedOneWithoutCodigosInput
  }

  export type CodigoAlmacenUncheckedCreateInput = {
    id?: number
    almacenId: number
    codigo: string
    rolAsignado: string
    permisos?: string | null
    usosDisponibles?: number | null
    activo?: boolean
    fechaCreacion?: Date | string
    fechaExpiracion?: Date | string | null
    creadoPorId?: number | null
  }

  export type CodigoAlmacenUpdateInput = {
    codigo?: StringFieldUpdateOperationsInput | string
    rolAsignado?: StringFieldUpdateOperationsInput | string
    permisos?: NullableStringFieldUpdateOperationsInput | string | null
    usosDisponibles?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaExpiracion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoPorId?: NullableIntFieldUpdateOperationsInput | number | null
    almacen?: AlmacenUpdateOneRequiredWithoutCodigosNestedInput
  }

  export type CodigoAlmacenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    almacenId?: IntFieldUpdateOperationsInput | number
    codigo?: StringFieldUpdateOperationsInput | string
    rolAsignado?: StringFieldUpdateOperationsInput | string
    permisos?: NullableStringFieldUpdateOperationsInput | string | null
    usosDisponibles?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaExpiracion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoPorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CodigoAlmacenCreateManyInput = {
    id?: number
    almacenId: number
    codigo: string
    rolAsignado: string
    permisos?: string | null
    usosDisponibles?: number | null
    activo?: boolean
    fechaCreacion?: Date | string
    fechaExpiracion?: Date | string | null
    creadoPorId?: number | null
  }

  export type CodigoAlmacenUpdateManyMutationInput = {
    codigo?: StringFieldUpdateOperationsInput | string
    rolAsignado?: StringFieldUpdateOperationsInput | string
    permisos?: NullableStringFieldUpdateOperationsInput | string | null
    usosDisponibles?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaExpiracion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoPorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CodigoAlmacenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    almacenId?: IntFieldUpdateOperationsInput | number
    codigo?: StringFieldUpdateOperationsInput | string
    rolAsignado?: StringFieldUpdateOperationsInput | string
    permisos?: NullableStringFieldUpdateOperationsInput | string | null
    usosDisponibles?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaExpiracion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoPorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UsuarioListRelationFilter = {
    every?: UsuarioWhereInput
    some?: UsuarioWhereInput
    none?: UsuarioWhereInput
  }

  export type AlmacenListRelationFilter = {
    every?: AlmacenWhereInput
    some?: AlmacenWhereInput
    none?: AlmacenWhereInput
  }

  export type RolListRelationFilter = {
    every?: RolWhereInput
    some?: RolWhereInput
    none?: RolWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UsuarioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlmacenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RolOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EntidadCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    tipo?: SortOrder
    correoContacto?: SortOrder
    telefono?: SortOrder
    direccion?: SortOrder
    fechaCreacion?: SortOrder
  }

  export type EntidadAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EntidadMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    tipo?: SortOrder
    correoContacto?: SortOrder
    telefono?: SortOrder
    direccion?: SortOrder
    fechaCreacion?: SortOrder
  }

  export type EntidadMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    tipo?: SortOrder
    correoContacto?: SortOrder
    telefono?: SortOrder
    direccion?: SortOrder
    fechaCreacion?: SortOrder
  }

  export type EntidadSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
  }

  export type EntidadNullableScalarRelationFilter = {
    is?: EntidadWhereInput | null
    isNot?: EntidadWhereInput | null
  }

  export type UsuarioAlmacenListRelationFilter = {
    every?: UsuarioAlmacenWhereInput
    some?: UsuarioAlmacenWhereInput
    none?: UsuarioAlmacenWhereInput
  }

  export type UsuarioAlmacenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    contrasena?: SortOrder
    googleId?: SortOrder
    tipoCuenta?: SortOrder
    estado?: SortOrder
    fechaRegistro?: SortOrder
    entidadId?: SortOrder
    codigoUsado?: SortOrder
    archivoNombre?: SortOrder
    archivoBuffer?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    id?: SortOrder
    entidadId?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    contrasena?: SortOrder
    googleId?: SortOrder
    tipoCuenta?: SortOrder
    estado?: SortOrder
    fechaRegistro?: SortOrder
    entidadId?: SortOrder
    codigoUsado?: SortOrder
    archivoNombre?: SortOrder
    archivoBuffer?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    contrasena?: SortOrder
    googleId?: SortOrder
    tipoCuenta?: SortOrder
    estado?: SortOrder
    fechaRegistro?: SortOrder
    entidadId?: SortOrder
    codigoUsado?: SortOrder
    archivoNombre?: SortOrder
    archivoBuffer?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    id?: SortOrder
    entidadId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type RolCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    permisos?: SortOrder
    entidadId?: SortOrder
  }

  export type RolAvgOrderByAggregateInput = {
    id?: SortOrder
    entidadId?: SortOrder
  }

  export type RolMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    permisos?: SortOrder
    entidadId?: SortOrder
  }

  export type RolMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    permisos?: SortOrder
    entidadId?: SortOrder
  }

  export type RolSumOrderByAggregateInput = {
    id?: SortOrder
    entidadId?: SortOrder
  }

  export type EntidadScalarRelationFilter = {
    is?: EntidadWhereInput
    isNot?: EntidadWhereInput
  }

  export type CodigoAlmacenListRelationFilter = {
    every?: CodigoAlmacenWhereInput
    some?: CodigoAlmacenWhereInput
    none?: CodigoAlmacenWhereInput
  }

  export type CodigoAlmacenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlmacenCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    imagenUrl?: SortOrder
    codigoUnico?: SortOrder
    funciones?: SortOrder
    permisosPredeterminados?: SortOrder
    fechaCreacion?: SortOrder
    entidadId?: SortOrder
  }

  export type AlmacenAvgOrderByAggregateInput = {
    id?: SortOrder
    entidadId?: SortOrder
  }

  export type AlmacenMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    imagenUrl?: SortOrder
    codigoUnico?: SortOrder
    funciones?: SortOrder
    permisosPredeterminados?: SortOrder
    fechaCreacion?: SortOrder
    entidadId?: SortOrder
  }

  export type AlmacenMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    imagenUrl?: SortOrder
    codigoUnico?: SortOrder
    funciones?: SortOrder
    permisosPredeterminados?: SortOrder
    fechaCreacion?: SortOrder
    entidadId?: SortOrder
  }

  export type AlmacenSumOrderByAggregateInput = {
    id?: SortOrder
    entidadId?: SortOrder
  }

  export type UsuarioScalarRelationFilter = {
    is?: UsuarioWhereInput
    isNot?: UsuarioWhereInput
  }

  export type AlmacenScalarRelationFilter = {
    is?: AlmacenWhereInput
    isNot?: AlmacenWhereInput
  }

  export type UsuarioAlmacenUsuarioIdAlmacenIdCompoundUniqueInput = {
    usuarioId: number
    almacenId: number
  }

  export type UsuarioAlmacenCountOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    almacenId?: SortOrder
    rolEnAlmacen?: SortOrder
    permisosExtra?: SortOrder
  }

  export type UsuarioAlmacenAvgOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    almacenId?: SortOrder
  }

  export type UsuarioAlmacenMaxOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    almacenId?: SortOrder
    rolEnAlmacen?: SortOrder
    permisosExtra?: SortOrder
  }

  export type UsuarioAlmacenMinOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    almacenId?: SortOrder
    rolEnAlmacen?: SortOrder
    permisosExtra?: SortOrder
  }

  export type UsuarioAlmacenSumOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    almacenId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type CodigoAlmacenCountOrderByAggregateInput = {
    id?: SortOrder
    almacenId?: SortOrder
    codigo?: SortOrder
    rolAsignado?: SortOrder
    permisos?: SortOrder
    usosDisponibles?: SortOrder
    activo?: SortOrder
    fechaCreacion?: SortOrder
    fechaExpiracion?: SortOrder
    creadoPorId?: SortOrder
  }

  export type CodigoAlmacenAvgOrderByAggregateInput = {
    id?: SortOrder
    almacenId?: SortOrder
    usosDisponibles?: SortOrder
    creadoPorId?: SortOrder
  }

  export type CodigoAlmacenMaxOrderByAggregateInput = {
    id?: SortOrder
    almacenId?: SortOrder
    codigo?: SortOrder
    rolAsignado?: SortOrder
    permisos?: SortOrder
    usosDisponibles?: SortOrder
    activo?: SortOrder
    fechaCreacion?: SortOrder
    fechaExpiracion?: SortOrder
    creadoPorId?: SortOrder
  }

  export type CodigoAlmacenMinOrderByAggregateInput = {
    id?: SortOrder
    almacenId?: SortOrder
    codigo?: SortOrder
    rolAsignado?: SortOrder
    permisos?: SortOrder
    usosDisponibles?: SortOrder
    activo?: SortOrder
    fechaCreacion?: SortOrder
    fechaExpiracion?: SortOrder
    creadoPorId?: SortOrder
  }

  export type CodigoAlmacenSumOrderByAggregateInput = {
    id?: SortOrder
    almacenId?: SortOrder
    usosDisponibles?: SortOrder
    creadoPorId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UsuarioCreateNestedManyWithoutEntidadInput = {
    create?: XOR<UsuarioCreateWithoutEntidadInput, UsuarioUncheckedCreateWithoutEntidadInput> | UsuarioCreateWithoutEntidadInput[] | UsuarioUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEntidadInput | UsuarioCreateOrConnectWithoutEntidadInput[]
    createMany?: UsuarioCreateManyEntidadInputEnvelope
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
  }

  export type AlmacenCreateNestedManyWithoutEntidadInput = {
    create?: XOR<AlmacenCreateWithoutEntidadInput, AlmacenUncheckedCreateWithoutEntidadInput> | AlmacenCreateWithoutEntidadInput[] | AlmacenUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: AlmacenCreateOrConnectWithoutEntidadInput | AlmacenCreateOrConnectWithoutEntidadInput[]
    createMany?: AlmacenCreateManyEntidadInputEnvelope
    connect?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
  }

  export type RolCreateNestedManyWithoutEntidadInput = {
    create?: XOR<RolCreateWithoutEntidadInput, RolUncheckedCreateWithoutEntidadInput> | RolCreateWithoutEntidadInput[] | RolUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: RolCreateOrConnectWithoutEntidadInput | RolCreateOrConnectWithoutEntidadInput[]
    createMany?: RolCreateManyEntidadInputEnvelope
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
  }

  export type UsuarioUncheckedCreateNestedManyWithoutEntidadInput = {
    create?: XOR<UsuarioCreateWithoutEntidadInput, UsuarioUncheckedCreateWithoutEntidadInput> | UsuarioCreateWithoutEntidadInput[] | UsuarioUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEntidadInput | UsuarioCreateOrConnectWithoutEntidadInput[]
    createMany?: UsuarioCreateManyEntidadInputEnvelope
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
  }

  export type AlmacenUncheckedCreateNestedManyWithoutEntidadInput = {
    create?: XOR<AlmacenCreateWithoutEntidadInput, AlmacenUncheckedCreateWithoutEntidadInput> | AlmacenCreateWithoutEntidadInput[] | AlmacenUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: AlmacenCreateOrConnectWithoutEntidadInput | AlmacenCreateOrConnectWithoutEntidadInput[]
    createMany?: AlmacenCreateManyEntidadInputEnvelope
    connect?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
  }

  export type RolUncheckedCreateNestedManyWithoutEntidadInput = {
    create?: XOR<RolCreateWithoutEntidadInput, RolUncheckedCreateWithoutEntidadInput> | RolCreateWithoutEntidadInput[] | RolUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: RolCreateOrConnectWithoutEntidadInput | RolCreateOrConnectWithoutEntidadInput[]
    createMany?: RolCreateManyEntidadInputEnvelope
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UsuarioUpdateManyWithoutEntidadNestedInput = {
    create?: XOR<UsuarioCreateWithoutEntidadInput, UsuarioUncheckedCreateWithoutEntidadInput> | UsuarioCreateWithoutEntidadInput[] | UsuarioUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEntidadInput | UsuarioCreateOrConnectWithoutEntidadInput[]
    upsert?: UsuarioUpsertWithWhereUniqueWithoutEntidadInput | UsuarioUpsertWithWhereUniqueWithoutEntidadInput[]
    createMany?: UsuarioCreateManyEntidadInputEnvelope
    set?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    disconnect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    delete?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    update?: UsuarioUpdateWithWhereUniqueWithoutEntidadInput | UsuarioUpdateWithWhereUniqueWithoutEntidadInput[]
    updateMany?: UsuarioUpdateManyWithWhereWithoutEntidadInput | UsuarioUpdateManyWithWhereWithoutEntidadInput[]
    deleteMany?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
  }

  export type AlmacenUpdateManyWithoutEntidadNestedInput = {
    create?: XOR<AlmacenCreateWithoutEntidadInput, AlmacenUncheckedCreateWithoutEntidadInput> | AlmacenCreateWithoutEntidadInput[] | AlmacenUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: AlmacenCreateOrConnectWithoutEntidadInput | AlmacenCreateOrConnectWithoutEntidadInput[]
    upsert?: AlmacenUpsertWithWhereUniqueWithoutEntidadInput | AlmacenUpsertWithWhereUniqueWithoutEntidadInput[]
    createMany?: AlmacenCreateManyEntidadInputEnvelope
    set?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    disconnect?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    delete?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    connect?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    update?: AlmacenUpdateWithWhereUniqueWithoutEntidadInput | AlmacenUpdateWithWhereUniqueWithoutEntidadInput[]
    updateMany?: AlmacenUpdateManyWithWhereWithoutEntidadInput | AlmacenUpdateManyWithWhereWithoutEntidadInput[]
    deleteMany?: AlmacenScalarWhereInput | AlmacenScalarWhereInput[]
  }

  export type RolUpdateManyWithoutEntidadNestedInput = {
    create?: XOR<RolCreateWithoutEntidadInput, RolUncheckedCreateWithoutEntidadInput> | RolCreateWithoutEntidadInput[] | RolUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: RolCreateOrConnectWithoutEntidadInput | RolCreateOrConnectWithoutEntidadInput[]
    upsert?: RolUpsertWithWhereUniqueWithoutEntidadInput | RolUpsertWithWhereUniqueWithoutEntidadInput[]
    createMany?: RolCreateManyEntidadInputEnvelope
    set?: RolWhereUniqueInput | RolWhereUniqueInput[]
    disconnect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    delete?: RolWhereUniqueInput | RolWhereUniqueInput[]
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    update?: RolUpdateWithWhereUniqueWithoutEntidadInput | RolUpdateWithWhereUniqueWithoutEntidadInput[]
    updateMany?: RolUpdateManyWithWhereWithoutEntidadInput | RolUpdateManyWithWhereWithoutEntidadInput[]
    deleteMany?: RolScalarWhereInput | RolScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UsuarioUncheckedUpdateManyWithoutEntidadNestedInput = {
    create?: XOR<UsuarioCreateWithoutEntidadInput, UsuarioUncheckedCreateWithoutEntidadInput> | UsuarioCreateWithoutEntidadInput[] | UsuarioUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEntidadInput | UsuarioCreateOrConnectWithoutEntidadInput[]
    upsert?: UsuarioUpsertWithWhereUniqueWithoutEntidadInput | UsuarioUpsertWithWhereUniqueWithoutEntidadInput[]
    createMany?: UsuarioCreateManyEntidadInputEnvelope
    set?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    disconnect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    delete?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    update?: UsuarioUpdateWithWhereUniqueWithoutEntidadInput | UsuarioUpdateWithWhereUniqueWithoutEntidadInput[]
    updateMany?: UsuarioUpdateManyWithWhereWithoutEntidadInput | UsuarioUpdateManyWithWhereWithoutEntidadInput[]
    deleteMany?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
  }

  export type AlmacenUncheckedUpdateManyWithoutEntidadNestedInput = {
    create?: XOR<AlmacenCreateWithoutEntidadInput, AlmacenUncheckedCreateWithoutEntidadInput> | AlmacenCreateWithoutEntidadInput[] | AlmacenUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: AlmacenCreateOrConnectWithoutEntidadInput | AlmacenCreateOrConnectWithoutEntidadInput[]
    upsert?: AlmacenUpsertWithWhereUniqueWithoutEntidadInput | AlmacenUpsertWithWhereUniqueWithoutEntidadInput[]
    createMany?: AlmacenCreateManyEntidadInputEnvelope
    set?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    disconnect?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    delete?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    connect?: AlmacenWhereUniqueInput | AlmacenWhereUniqueInput[]
    update?: AlmacenUpdateWithWhereUniqueWithoutEntidadInput | AlmacenUpdateWithWhereUniqueWithoutEntidadInput[]
    updateMany?: AlmacenUpdateManyWithWhereWithoutEntidadInput | AlmacenUpdateManyWithWhereWithoutEntidadInput[]
    deleteMany?: AlmacenScalarWhereInput | AlmacenScalarWhereInput[]
  }

  export type RolUncheckedUpdateManyWithoutEntidadNestedInput = {
    create?: XOR<RolCreateWithoutEntidadInput, RolUncheckedCreateWithoutEntidadInput> | RolCreateWithoutEntidadInput[] | RolUncheckedCreateWithoutEntidadInput[]
    connectOrCreate?: RolCreateOrConnectWithoutEntidadInput | RolCreateOrConnectWithoutEntidadInput[]
    upsert?: RolUpsertWithWhereUniqueWithoutEntidadInput | RolUpsertWithWhereUniqueWithoutEntidadInput[]
    createMany?: RolCreateManyEntidadInputEnvelope
    set?: RolWhereUniqueInput | RolWhereUniqueInput[]
    disconnect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    delete?: RolWhereUniqueInput | RolWhereUniqueInput[]
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    update?: RolUpdateWithWhereUniqueWithoutEntidadInput | RolUpdateWithWhereUniqueWithoutEntidadInput[]
    updateMany?: RolUpdateManyWithWhereWithoutEntidadInput | RolUpdateManyWithWhereWithoutEntidadInput[]
    deleteMany?: RolScalarWhereInput | RolScalarWhereInput[]
  }

  export type EntidadCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<EntidadCreateWithoutUsuariosInput, EntidadUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: EntidadCreateOrConnectWithoutUsuariosInput
    connect?: EntidadWhereUniqueInput
  }

  export type RolCreateNestedManyWithoutUsuariosInput = {
    create?: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput> | RolCreateWithoutUsuariosInput[] | RolUncheckedCreateWithoutUsuariosInput[]
    connectOrCreate?: RolCreateOrConnectWithoutUsuariosInput | RolCreateOrConnectWithoutUsuariosInput[]
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
  }

  export type UsuarioAlmacenCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutUsuarioInput, UsuarioAlmacenUncheckedCreateWithoutUsuarioInput> | UsuarioAlmacenCreateWithoutUsuarioInput[] | UsuarioAlmacenUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutUsuarioInput | UsuarioAlmacenCreateOrConnectWithoutUsuarioInput[]
    createMany?: UsuarioAlmacenCreateManyUsuarioInputEnvelope
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
  }

  export type RolUncheckedCreateNestedManyWithoutUsuariosInput = {
    create?: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput> | RolCreateWithoutUsuariosInput[] | RolUncheckedCreateWithoutUsuariosInput[]
    connectOrCreate?: RolCreateOrConnectWithoutUsuariosInput | RolCreateOrConnectWithoutUsuariosInput[]
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
  }

  export type UsuarioAlmacenUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutUsuarioInput, UsuarioAlmacenUncheckedCreateWithoutUsuarioInput> | UsuarioAlmacenCreateWithoutUsuarioInput[] | UsuarioAlmacenUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutUsuarioInput | UsuarioAlmacenCreateOrConnectWithoutUsuarioInput[]
    createMany?: UsuarioAlmacenCreateManyUsuarioInputEnvelope
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
  }

  export type NullableBytesFieldUpdateOperationsInput = {
    set?: Uint8Array | null
  }

  export type EntidadUpdateOneWithoutUsuariosNestedInput = {
    create?: XOR<EntidadCreateWithoutUsuariosInput, EntidadUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: EntidadCreateOrConnectWithoutUsuariosInput
    upsert?: EntidadUpsertWithoutUsuariosInput
    disconnect?: EntidadWhereInput | boolean
    delete?: EntidadWhereInput | boolean
    connect?: EntidadWhereUniqueInput
    update?: XOR<XOR<EntidadUpdateToOneWithWhereWithoutUsuariosInput, EntidadUpdateWithoutUsuariosInput>, EntidadUncheckedUpdateWithoutUsuariosInput>
  }

  export type RolUpdateManyWithoutUsuariosNestedInput = {
    create?: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput> | RolCreateWithoutUsuariosInput[] | RolUncheckedCreateWithoutUsuariosInput[]
    connectOrCreate?: RolCreateOrConnectWithoutUsuariosInput | RolCreateOrConnectWithoutUsuariosInput[]
    upsert?: RolUpsertWithWhereUniqueWithoutUsuariosInput | RolUpsertWithWhereUniqueWithoutUsuariosInput[]
    set?: RolWhereUniqueInput | RolWhereUniqueInput[]
    disconnect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    delete?: RolWhereUniqueInput | RolWhereUniqueInput[]
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    update?: RolUpdateWithWhereUniqueWithoutUsuariosInput | RolUpdateWithWhereUniqueWithoutUsuariosInput[]
    updateMany?: RolUpdateManyWithWhereWithoutUsuariosInput | RolUpdateManyWithWhereWithoutUsuariosInput[]
    deleteMany?: RolScalarWhereInput | RolScalarWhereInput[]
  }

  export type UsuarioAlmacenUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutUsuarioInput, UsuarioAlmacenUncheckedCreateWithoutUsuarioInput> | UsuarioAlmacenCreateWithoutUsuarioInput[] | UsuarioAlmacenUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutUsuarioInput | UsuarioAlmacenCreateOrConnectWithoutUsuarioInput[]
    upsert?: UsuarioAlmacenUpsertWithWhereUniqueWithoutUsuarioInput | UsuarioAlmacenUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: UsuarioAlmacenCreateManyUsuarioInputEnvelope
    set?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    disconnect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    delete?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    update?: UsuarioAlmacenUpdateWithWhereUniqueWithoutUsuarioInput | UsuarioAlmacenUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: UsuarioAlmacenUpdateManyWithWhereWithoutUsuarioInput | UsuarioAlmacenUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: UsuarioAlmacenScalarWhereInput | UsuarioAlmacenScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RolUncheckedUpdateManyWithoutUsuariosNestedInput = {
    create?: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput> | RolCreateWithoutUsuariosInput[] | RolUncheckedCreateWithoutUsuariosInput[]
    connectOrCreate?: RolCreateOrConnectWithoutUsuariosInput | RolCreateOrConnectWithoutUsuariosInput[]
    upsert?: RolUpsertWithWhereUniqueWithoutUsuariosInput | RolUpsertWithWhereUniqueWithoutUsuariosInput[]
    set?: RolWhereUniqueInput | RolWhereUniqueInput[]
    disconnect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    delete?: RolWhereUniqueInput | RolWhereUniqueInput[]
    connect?: RolWhereUniqueInput | RolWhereUniqueInput[]
    update?: RolUpdateWithWhereUniqueWithoutUsuariosInput | RolUpdateWithWhereUniqueWithoutUsuariosInput[]
    updateMany?: RolUpdateManyWithWhereWithoutUsuariosInput | RolUpdateManyWithWhereWithoutUsuariosInput[]
    deleteMany?: RolScalarWhereInput | RolScalarWhereInput[]
  }

  export type UsuarioAlmacenUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutUsuarioInput, UsuarioAlmacenUncheckedCreateWithoutUsuarioInput> | UsuarioAlmacenCreateWithoutUsuarioInput[] | UsuarioAlmacenUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutUsuarioInput | UsuarioAlmacenCreateOrConnectWithoutUsuarioInput[]
    upsert?: UsuarioAlmacenUpsertWithWhereUniqueWithoutUsuarioInput | UsuarioAlmacenUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: UsuarioAlmacenCreateManyUsuarioInputEnvelope
    set?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    disconnect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    delete?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    update?: UsuarioAlmacenUpdateWithWhereUniqueWithoutUsuarioInput | UsuarioAlmacenUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: UsuarioAlmacenUpdateManyWithWhereWithoutUsuarioInput | UsuarioAlmacenUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: UsuarioAlmacenScalarWhereInput | UsuarioAlmacenScalarWhereInput[]
  }

  export type EntidadCreateNestedOneWithoutRolesInput = {
    create?: XOR<EntidadCreateWithoutRolesInput, EntidadUncheckedCreateWithoutRolesInput>
    connectOrCreate?: EntidadCreateOrConnectWithoutRolesInput
    connect?: EntidadWhereUniqueInput
  }

  export type UsuarioCreateNestedManyWithoutRolesInput = {
    create?: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput> | UsuarioCreateWithoutRolesInput[] | UsuarioUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutRolesInput | UsuarioCreateOrConnectWithoutRolesInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
  }

  export type UsuarioUncheckedCreateNestedManyWithoutRolesInput = {
    create?: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput> | UsuarioCreateWithoutRolesInput[] | UsuarioUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutRolesInput | UsuarioCreateOrConnectWithoutRolesInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
  }

  export type EntidadUpdateOneWithoutRolesNestedInput = {
    create?: XOR<EntidadCreateWithoutRolesInput, EntidadUncheckedCreateWithoutRolesInput>
    connectOrCreate?: EntidadCreateOrConnectWithoutRolesInput
    upsert?: EntidadUpsertWithoutRolesInput
    disconnect?: EntidadWhereInput | boolean
    delete?: EntidadWhereInput | boolean
    connect?: EntidadWhereUniqueInput
    update?: XOR<XOR<EntidadUpdateToOneWithWhereWithoutRolesInput, EntidadUpdateWithoutRolesInput>, EntidadUncheckedUpdateWithoutRolesInput>
  }

  export type UsuarioUpdateManyWithoutRolesNestedInput = {
    create?: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput> | UsuarioCreateWithoutRolesInput[] | UsuarioUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutRolesInput | UsuarioCreateOrConnectWithoutRolesInput[]
    upsert?: UsuarioUpsertWithWhereUniqueWithoutRolesInput | UsuarioUpsertWithWhereUniqueWithoutRolesInput[]
    set?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    disconnect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    delete?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    update?: UsuarioUpdateWithWhereUniqueWithoutRolesInput | UsuarioUpdateWithWhereUniqueWithoutRolesInput[]
    updateMany?: UsuarioUpdateManyWithWhereWithoutRolesInput | UsuarioUpdateManyWithWhereWithoutRolesInput[]
    deleteMany?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
  }

  export type UsuarioUncheckedUpdateManyWithoutRolesNestedInput = {
    create?: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput> | UsuarioCreateWithoutRolesInput[] | UsuarioUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutRolesInput | UsuarioCreateOrConnectWithoutRolesInput[]
    upsert?: UsuarioUpsertWithWhereUniqueWithoutRolesInput | UsuarioUpsertWithWhereUniqueWithoutRolesInput[]
    set?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    disconnect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    delete?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    update?: UsuarioUpdateWithWhereUniqueWithoutRolesInput | UsuarioUpdateWithWhereUniqueWithoutRolesInput[]
    updateMany?: UsuarioUpdateManyWithWhereWithoutRolesInput | UsuarioUpdateManyWithWhereWithoutRolesInput[]
    deleteMany?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
  }

  export type EntidadCreateNestedOneWithoutAlmacenesInput = {
    create?: XOR<EntidadCreateWithoutAlmacenesInput, EntidadUncheckedCreateWithoutAlmacenesInput>
    connectOrCreate?: EntidadCreateOrConnectWithoutAlmacenesInput
    connect?: EntidadWhereUniqueInput
  }

  export type UsuarioAlmacenCreateNestedManyWithoutAlmacenInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutAlmacenInput, UsuarioAlmacenUncheckedCreateWithoutAlmacenInput> | UsuarioAlmacenCreateWithoutAlmacenInput[] | UsuarioAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutAlmacenInput | UsuarioAlmacenCreateOrConnectWithoutAlmacenInput[]
    createMany?: UsuarioAlmacenCreateManyAlmacenInputEnvelope
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
  }

  export type CodigoAlmacenCreateNestedManyWithoutAlmacenInput = {
    create?: XOR<CodigoAlmacenCreateWithoutAlmacenInput, CodigoAlmacenUncheckedCreateWithoutAlmacenInput> | CodigoAlmacenCreateWithoutAlmacenInput[] | CodigoAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: CodigoAlmacenCreateOrConnectWithoutAlmacenInput | CodigoAlmacenCreateOrConnectWithoutAlmacenInput[]
    createMany?: CodigoAlmacenCreateManyAlmacenInputEnvelope
    connect?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
  }

  export type UsuarioAlmacenUncheckedCreateNestedManyWithoutAlmacenInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutAlmacenInput, UsuarioAlmacenUncheckedCreateWithoutAlmacenInput> | UsuarioAlmacenCreateWithoutAlmacenInput[] | UsuarioAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutAlmacenInput | UsuarioAlmacenCreateOrConnectWithoutAlmacenInput[]
    createMany?: UsuarioAlmacenCreateManyAlmacenInputEnvelope
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
  }

  export type CodigoAlmacenUncheckedCreateNestedManyWithoutAlmacenInput = {
    create?: XOR<CodigoAlmacenCreateWithoutAlmacenInput, CodigoAlmacenUncheckedCreateWithoutAlmacenInput> | CodigoAlmacenCreateWithoutAlmacenInput[] | CodigoAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: CodigoAlmacenCreateOrConnectWithoutAlmacenInput | CodigoAlmacenCreateOrConnectWithoutAlmacenInput[]
    createMany?: CodigoAlmacenCreateManyAlmacenInputEnvelope
    connect?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
  }

  export type EntidadUpdateOneRequiredWithoutAlmacenesNestedInput = {
    create?: XOR<EntidadCreateWithoutAlmacenesInput, EntidadUncheckedCreateWithoutAlmacenesInput>
    connectOrCreate?: EntidadCreateOrConnectWithoutAlmacenesInput
    upsert?: EntidadUpsertWithoutAlmacenesInput
    connect?: EntidadWhereUniqueInput
    update?: XOR<XOR<EntidadUpdateToOneWithWhereWithoutAlmacenesInput, EntidadUpdateWithoutAlmacenesInput>, EntidadUncheckedUpdateWithoutAlmacenesInput>
  }

  export type UsuarioAlmacenUpdateManyWithoutAlmacenNestedInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutAlmacenInput, UsuarioAlmacenUncheckedCreateWithoutAlmacenInput> | UsuarioAlmacenCreateWithoutAlmacenInput[] | UsuarioAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutAlmacenInput | UsuarioAlmacenCreateOrConnectWithoutAlmacenInput[]
    upsert?: UsuarioAlmacenUpsertWithWhereUniqueWithoutAlmacenInput | UsuarioAlmacenUpsertWithWhereUniqueWithoutAlmacenInput[]
    createMany?: UsuarioAlmacenCreateManyAlmacenInputEnvelope
    set?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    disconnect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    delete?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    update?: UsuarioAlmacenUpdateWithWhereUniqueWithoutAlmacenInput | UsuarioAlmacenUpdateWithWhereUniqueWithoutAlmacenInput[]
    updateMany?: UsuarioAlmacenUpdateManyWithWhereWithoutAlmacenInput | UsuarioAlmacenUpdateManyWithWhereWithoutAlmacenInput[]
    deleteMany?: UsuarioAlmacenScalarWhereInput | UsuarioAlmacenScalarWhereInput[]
  }

  export type CodigoAlmacenUpdateManyWithoutAlmacenNestedInput = {
    create?: XOR<CodigoAlmacenCreateWithoutAlmacenInput, CodigoAlmacenUncheckedCreateWithoutAlmacenInput> | CodigoAlmacenCreateWithoutAlmacenInput[] | CodigoAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: CodigoAlmacenCreateOrConnectWithoutAlmacenInput | CodigoAlmacenCreateOrConnectWithoutAlmacenInput[]
    upsert?: CodigoAlmacenUpsertWithWhereUniqueWithoutAlmacenInput | CodigoAlmacenUpsertWithWhereUniqueWithoutAlmacenInput[]
    createMany?: CodigoAlmacenCreateManyAlmacenInputEnvelope
    set?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    disconnect?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    delete?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    connect?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    update?: CodigoAlmacenUpdateWithWhereUniqueWithoutAlmacenInput | CodigoAlmacenUpdateWithWhereUniqueWithoutAlmacenInput[]
    updateMany?: CodigoAlmacenUpdateManyWithWhereWithoutAlmacenInput | CodigoAlmacenUpdateManyWithWhereWithoutAlmacenInput[]
    deleteMany?: CodigoAlmacenScalarWhereInput | CodigoAlmacenScalarWhereInput[]
  }

  export type UsuarioAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput = {
    create?: XOR<UsuarioAlmacenCreateWithoutAlmacenInput, UsuarioAlmacenUncheckedCreateWithoutAlmacenInput> | UsuarioAlmacenCreateWithoutAlmacenInput[] | UsuarioAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: UsuarioAlmacenCreateOrConnectWithoutAlmacenInput | UsuarioAlmacenCreateOrConnectWithoutAlmacenInput[]
    upsert?: UsuarioAlmacenUpsertWithWhereUniqueWithoutAlmacenInput | UsuarioAlmacenUpsertWithWhereUniqueWithoutAlmacenInput[]
    createMany?: UsuarioAlmacenCreateManyAlmacenInputEnvelope
    set?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    disconnect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    delete?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    connect?: UsuarioAlmacenWhereUniqueInput | UsuarioAlmacenWhereUniqueInput[]
    update?: UsuarioAlmacenUpdateWithWhereUniqueWithoutAlmacenInput | UsuarioAlmacenUpdateWithWhereUniqueWithoutAlmacenInput[]
    updateMany?: UsuarioAlmacenUpdateManyWithWhereWithoutAlmacenInput | UsuarioAlmacenUpdateManyWithWhereWithoutAlmacenInput[]
    deleteMany?: UsuarioAlmacenScalarWhereInput | UsuarioAlmacenScalarWhereInput[]
  }

  export type CodigoAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput = {
    create?: XOR<CodigoAlmacenCreateWithoutAlmacenInput, CodigoAlmacenUncheckedCreateWithoutAlmacenInput> | CodigoAlmacenCreateWithoutAlmacenInput[] | CodigoAlmacenUncheckedCreateWithoutAlmacenInput[]
    connectOrCreate?: CodigoAlmacenCreateOrConnectWithoutAlmacenInput | CodigoAlmacenCreateOrConnectWithoutAlmacenInput[]
    upsert?: CodigoAlmacenUpsertWithWhereUniqueWithoutAlmacenInput | CodigoAlmacenUpsertWithWhereUniqueWithoutAlmacenInput[]
    createMany?: CodigoAlmacenCreateManyAlmacenInputEnvelope
    set?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    disconnect?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    delete?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    connect?: CodigoAlmacenWhereUniqueInput | CodigoAlmacenWhereUniqueInput[]
    update?: CodigoAlmacenUpdateWithWhereUniqueWithoutAlmacenInput | CodigoAlmacenUpdateWithWhereUniqueWithoutAlmacenInput[]
    updateMany?: CodigoAlmacenUpdateManyWithWhereWithoutAlmacenInput | CodigoAlmacenUpdateManyWithWhereWithoutAlmacenInput[]
    deleteMany?: CodigoAlmacenScalarWhereInput | CodigoAlmacenScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutAlmacenesInput = {
    create?: XOR<UsuarioCreateWithoutAlmacenesInput, UsuarioUncheckedCreateWithoutAlmacenesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutAlmacenesInput
    connect?: UsuarioWhereUniqueInput
  }

  export type AlmacenCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<AlmacenCreateWithoutUsuariosInput, AlmacenUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: AlmacenCreateOrConnectWithoutUsuariosInput
    connect?: AlmacenWhereUniqueInput
  }

  export type UsuarioUpdateOneRequiredWithoutAlmacenesNestedInput = {
    create?: XOR<UsuarioCreateWithoutAlmacenesInput, UsuarioUncheckedCreateWithoutAlmacenesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutAlmacenesInput
    upsert?: UsuarioUpsertWithoutAlmacenesInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutAlmacenesInput, UsuarioUpdateWithoutAlmacenesInput>, UsuarioUncheckedUpdateWithoutAlmacenesInput>
  }

  export type AlmacenUpdateOneRequiredWithoutUsuariosNestedInput = {
    create?: XOR<AlmacenCreateWithoutUsuariosInput, AlmacenUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: AlmacenCreateOrConnectWithoutUsuariosInput
    upsert?: AlmacenUpsertWithoutUsuariosInput
    connect?: AlmacenWhereUniqueInput
    update?: XOR<XOR<AlmacenUpdateToOneWithWhereWithoutUsuariosInput, AlmacenUpdateWithoutUsuariosInput>, AlmacenUncheckedUpdateWithoutUsuariosInput>
  }

  export type AlmacenCreateNestedOneWithoutCodigosInput = {
    create?: XOR<AlmacenCreateWithoutCodigosInput, AlmacenUncheckedCreateWithoutCodigosInput>
    connectOrCreate?: AlmacenCreateOrConnectWithoutCodigosInput
    connect?: AlmacenWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AlmacenUpdateOneRequiredWithoutCodigosNestedInput = {
    create?: XOR<AlmacenCreateWithoutCodigosInput, AlmacenUncheckedCreateWithoutCodigosInput>
    connectOrCreate?: AlmacenCreateOrConnectWithoutCodigosInput
    upsert?: AlmacenUpsertWithoutCodigosInput
    connect?: AlmacenWhereUniqueInput
    update?: XOR<XOR<AlmacenUpdateToOneWithWhereWithoutCodigosInput, AlmacenUpdateWithoutCodigosInput>, AlmacenUncheckedUpdateWithoutCodigosInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UsuarioCreateWithoutEntidadInput = {
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    roles?: RolCreateNestedManyWithoutUsuariosInput
    almacenes?: UsuarioAlmacenCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutEntidadInput = {
    id?: number
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    roles?: RolUncheckedCreateNestedManyWithoutUsuariosInput
    almacenes?: UsuarioAlmacenUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutEntidadInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutEntidadInput, UsuarioUncheckedCreateWithoutEntidadInput>
  }

  export type UsuarioCreateManyEntidadInputEnvelope = {
    data: UsuarioCreateManyEntidadInput | UsuarioCreateManyEntidadInput[]
    skipDuplicates?: boolean
  }

  export type AlmacenCreateWithoutEntidadInput = {
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioAlmacenCreateNestedManyWithoutAlmacenInput
    codigos?: CodigoAlmacenCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenUncheckedCreateWithoutEntidadInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioAlmacenUncheckedCreateNestedManyWithoutAlmacenInput
    codigos?: CodigoAlmacenUncheckedCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenCreateOrConnectWithoutEntidadInput = {
    where: AlmacenWhereUniqueInput
    create: XOR<AlmacenCreateWithoutEntidadInput, AlmacenUncheckedCreateWithoutEntidadInput>
  }

  export type AlmacenCreateManyEntidadInputEnvelope = {
    data: AlmacenCreateManyEntidadInput | AlmacenCreateManyEntidadInput[]
    skipDuplicates?: boolean
  }

  export type RolCreateWithoutEntidadInput = {
    nombre: string
    descripcion?: string | null
    permisos: string
    usuarios?: UsuarioCreateNestedManyWithoutRolesInput
  }

  export type RolUncheckedCreateWithoutEntidadInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    permisos: string
    usuarios?: UsuarioUncheckedCreateNestedManyWithoutRolesInput
  }

  export type RolCreateOrConnectWithoutEntidadInput = {
    where: RolWhereUniqueInput
    create: XOR<RolCreateWithoutEntidadInput, RolUncheckedCreateWithoutEntidadInput>
  }

  export type RolCreateManyEntidadInputEnvelope = {
    data: RolCreateManyEntidadInput | RolCreateManyEntidadInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithWhereUniqueWithoutEntidadInput = {
    where: UsuarioWhereUniqueInput
    update: XOR<UsuarioUpdateWithoutEntidadInput, UsuarioUncheckedUpdateWithoutEntidadInput>
    create: XOR<UsuarioCreateWithoutEntidadInput, UsuarioUncheckedCreateWithoutEntidadInput>
  }

  export type UsuarioUpdateWithWhereUniqueWithoutEntidadInput = {
    where: UsuarioWhereUniqueInput
    data: XOR<UsuarioUpdateWithoutEntidadInput, UsuarioUncheckedUpdateWithoutEntidadInput>
  }

  export type UsuarioUpdateManyWithWhereWithoutEntidadInput = {
    where: UsuarioScalarWhereInput
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyWithoutEntidadInput>
  }

  export type UsuarioScalarWhereInput = {
    AND?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
    OR?: UsuarioScalarWhereInput[]
    NOT?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
    id?: IntFilter<"Usuario"> | number
    nombre?: StringFilter<"Usuario"> | string
    apellidos?: StringFilter<"Usuario"> | string
    correo?: StringFilter<"Usuario"> | string
    contrasena?: StringFilter<"Usuario"> | string
    googleId?: StringNullableFilter<"Usuario"> | string | null
    tipoCuenta?: StringFilter<"Usuario"> | string
    estado?: StringFilter<"Usuario"> | string
    fechaRegistro?: DateTimeFilter<"Usuario"> | Date | string
    entidadId?: IntNullableFilter<"Usuario"> | number | null
    codigoUsado?: StringNullableFilter<"Usuario"> | string | null
    archivoNombre?: StringNullableFilter<"Usuario"> | string | null
    archivoBuffer?: BytesNullableFilter<"Usuario"> | Uint8Array | null
  }

  export type AlmacenUpsertWithWhereUniqueWithoutEntidadInput = {
    where: AlmacenWhereUniqueInput
    update: XOR<AlmacenUpdateWithoutEntidadInput, AlmacenUncheckedUpdateWithoutEntidadInput>
    create: XOR<AlmacenCreateWithoutEntidadInput, AlmacenUncheckedCreateWithoutEntidadInput>
  }

  export type AlmacenUpdateWithWhereUniqueWithoutEntidadInput = {
    where: AlmacenWhereUniqueInput
    data: XOR<AlmacenUpdateWithoutEntidadInput, AlmacenUncheckedUpdateWithoutEntidadInput>
  }

  export type AlmacenUpdateManyWithWhereWithoutEntidadInput = {
    where: AlmacenScalarWhereInput
    data: XOR<AlmacenUpdateManyMutationInput, AlmacenUncheckedUpdateManyWithoutEntidadInput>
  }

  export type AlmacenScalarWhereInput = {
    AND?: AlmacenScalarWhereInput | AlmacenScalarWhereInput[]
    OR?: AlmacenScalarWhereInput[]
    NOT?: AlmacenScalarWhereInput | AlmacenScalarWhereInput[]
    id?: IntFilter<"Almacen"> | number
    nombre?: StringFilter<"Almacen"> | string
    descripcion?: StringNullableFilter<"Almacen"> | string | null
    imagenUrl?: StringNullableFilter<"Almacen"> | string | null
    codigoUnico?: StringFilter<"Almacen"> | string
    funciones?: StringNullableFilter<"Almacen"> | string | null
    permisosPredeterminados?: StringNullableFilter<"Almacen"> | string | null
    fechaCreacion?: DateTimeFilter<"Almacen"> | Date | string
    entidadId?: IntFilter<"Almacen"> | number
  }

  export type RolUpsertWithWhereUniqueWithoutEntidadInput = {
    where: RolWhereUniqueInput
    update: XOR<RolUpdateWithoutEntidadInput, RolUncheckedUpdateWithoutEntidadInput>
    create: XOR<RolCreateWithoutEntidadInput, RolUncheckedCreateWithoutEntidadInput>
  }

  export type RolUpdateWithWhereUniqueWithoutEntidadInput = {
    where: RolWhereUniqueInput
    data: XOR<RolUpdateWithoutEntidadInput, RolUncheckedUpdateWithoutEntidadInput>
  }

  export type RolUpdateManyWithWhereWithoutEntidadInput = {
    where: RolScalarWhereInput
    data: XOR<RolUpdateManyMutationInput, RolUncheckedUpdateManyWithoutEntidadInput>
  }

  export type RolScalarWhereInput = {
    AND?: RolScalarWhereInput | RolScalarWhereInput[]
    OR?: RolScalarWhereInput[]
    NOT?: RolScalarWhereInput | RolScalarWhereInput[]
    id?: IntFilter<"Rol"> | number
    nombre?: StringFilter<"Rol"> | string
    descripcion?: StringNullableFilter<"Rol"> | string | null
    permisos?: StringFilter<"Rol"> | string
    entidadId?: IntNullableFilter<"Rol"> | number | null
  }

  export type EntidadCreateWithoutUsuariosInput = {
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    almacenes?: AlmacenCreateNestedManyWithoutEntidadInput
    roles?: RolCreateNestedManyWithoutEntidadInput
  }

  export type EntidadUncheckedCreateWithoutUsuariosInput = {
    id?: number
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    almacenes?: AlmacenUncheckedCreateNestedManyWithoutEntidadInput
    roles?: RolUncheckedCreateNestedManyWithoutEntidadInput
  }

  export type EntidadCreateOrConnectWithoutUsuariosInput = {
    where: EntidadWhereUniqueInput
    create: XOR<EntidadCreateWithoutUsuariosInput, EntidadUncheckedCreateWithoutUsuariosInput>
  }

  export type RolCreateWithoutUsuariosInput = {
    nombre: string
    descripcion?: string | null
    permisos: string
    entidad?: EntidadCreateNestedOneWithoutRolesInput
  }

  export type RolUncheckedCreateWithoutUsuariosInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    permisos: string
    entidadId?: number | null
  }

  export type RolCreateOrConnectWithoutUsuariosInput = {
    where: RolWhereUniqueInput
    create: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput>
  }

  export type UsuarioAlmacenCreateWithoutUsuarioInput = {
    rolEnAlmacen: string
    permisosExtra?: string | null
    almacen: AlmacenCreateNestedOneWithoutUsuariosInput
  }

  export type UsuarioAlmacenUncheckedCreateWithoutUsuarioInput = {
    id?: number
    almacenId: number
    rolEnAlmacen: string
    permisosExtra?: string | null
  }

  export type UsuarioAlmacenCreateOrConnectWithoutUsuarioInput = {
    where: UsuarioAlmacenWhereUniqueInput
    create: XOR<UsuarioAlmacenCreateWithoutUsuarioInput, UsuarioAlmacenUncheckedCreateWithoutUsuarioInput>
  }

  export type UsuarioAlmacenCreateManyUsuarioInputEnvelope = {
    data: UsuarioAlmacenCreateManyUsuarioInput | UsuarioAlmacenCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type EntidadUpsertWithoutUsuariosInput = {
    update: XOR<EntidadUpdateWithoutUsuariosInput, EntidadUncheckedUpdateWithoutUsuariosInput>
    create: XOR<EntidadCreateWithoutUsuariosInput, EntidadUncheckedCreateWithoutUsuariosInput>
    where?: EntidadWhereInput
  }

  export type EntidadUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: EntidadWhereInput
    data: XOR<EntidadUpdateWithoutUsuariosInput, EntidadUncheckedUpdateWithoutUsuariosInput>
  }

  export type EntidadUpdateWithoutUsuariosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    almacenes?: AlmacenUpdateManyWithoutEntidadNestedInput
    roles?: RolUpdateManyWithoutEntidadNestedInput
  }

  export type EntidadUncheckedUpdateWithoutUsuariosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    almacenes?: AlmacenUncheckedUpdateManyWithoutEntidadNestedInput
    roles?: RolUncheckedUpdateManyWithoutEntidadNestedInput
  }

  export type RolUpsertWithWhereUniqueWithoutUsuariosInput = {
    where: RolWhereUniqueInput
    update: XOR<RolUpdateWithoutUsuariosInput, RolUncheckedUpdateWithoutUsuariosInput>
    create: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput>
  }

  export type RolUpdateWithWhereUniqueWithoutUsuariosInput = {
    where: RolWhereUniqueInput
    data: XOR<RolUpdateWithoutUsuariosInput, RolUncheckedUpdateWithoutUsuariosInput>
  }

  export type RolUpdateManyWithWhereWithoutUsuariosInput = {
    where: RolScalarWhereInput
    data: XOR<RolUpdateManyMutationInput, RolUncheckedUpdateManyWithoutUsuariosInput>
  }

  export type UsuarioAlmacenUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: UsuarioAlmacenWhereUniqueInput
    update: XOR<UsuarioAlmacenUpdateWithoutUsuarioInput, UsuarioAlmacenUncheckedUpdateWithoutUsuarioInput>
    create: XOR<UsuarioAlmacenCreateWithoutUsuarioInput, UsuarioAlmacenUncheckedCreateWithoutUsuarioInput>
  }

  export type UsuarioAlmacenUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: UsuarioAlmacenWhereUniqueInput
    data: XOR<UsuarioAlmacenUpdateWithoutUsuarioInput, UsuarioAlmacenUncheckedUpdateWithoutUsuarioInput>
  }

  export type UsuarioAlmacenUpdateManyWithWhereWithoutUsuarioInput = {
    where: UsuarioAlmacenScalarWhereInput
    data: XOR<UsuarioAlmacenUpdateManyMutationInput, UsuarioAlmacenUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type UsuarioAlmacenScalarWhereInput = {
    AND?: UsuarioAlmacenScalarWhereInput | UsuarioAlmacenScalarWhereInput[]
    OR?: UsuarioAlmacenScalarWhereInput[]
    NOT?: UsuarioAlmacenScalarWhereInput | UsuarioAlmacenScalarWhereInput[]
    id?: IntFilter<"UsuarioAlmacen"> | number
    usuarioId?: IntFilter<"UsuarioAlmacen"> | number
    almacenId?: IntFilter<"UsuarioAlmacen"> | number
    rolEnAlmacen?: StringFilter<"UsuarioAlmacen"> | string
    permisosExtra?: StringNullableFilter<"UsuarioAlmacen"> | string | null
  }

  export type EntidadCreateWithoutRolesInput = {
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioCreateNestedManyWithoutEntidadInput
    almacenes?: AlmacenCreateNestedManyWithoutEntidadInput
  }

  export type EntidadUncheckedCreateWithoutRolesInput = {
    id?: number
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioUncheckedCreateNestedManyWithoutEntidadInput
    almacenes?: AlmacenUncheckedCreateNestedManyWithoutEntidadInput
  }

  export type EntidadCreateOrConnectWithoutRolesInput = {
    where: EntidadWhereUniqueInput
    create: XOR<EntidadCreateWithoutRolesInput, EntidadUncheckedCreateWithoutRolesInput>
  }

  export type UsuarioCreateWithoutRolesInput = {
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    entidad?: EntidadCreateNestedOneWithoutUsuariosInput
    almacenes?: UsuarioAlmacenCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutRolesInput = {
    id?: number
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    entidadId?: number | null
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    almacenes?: UsuarioAlmacenUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutRolesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput>
  }

  export type EntidadUpsertWithoutRolesInput = {
    update: XOR<EntidadUpdateWithoutRolesInput, EntidadUncheckedUpdateWithoutRolesInput>
    create: XOR<EntidadCreateWithoutRolesInput, EntidadUncheckedCreateWithoutRolesInput>
    where?: EntidadWhereInput
  }

  export type EntidadUpdateToOneWithWhereWithoutRolesInput = {
    where?: EntidadWhereInput
    data: XOR<EntidadUpdateWithoutRolesInput, EntidadUncheckedUpdateWithoutRolesInput>
  }

  export type EntidadUpdateWithoutRolesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUpdateManyWithoutEntidadNestedInput
    almacenes?: AlmacenUpdateManyWithoutEntidadNestedInput
  }

  export type EntidadUncheckedUpdateWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUncheckedUpdateManyWithoutEntidadNestedInput
    almacenes?: AlmacenUncheckedUpdateManyWithoutEntidadNestedInput
  }

  export type UsuarioUpsertWithWhereUniqueWithoutRolesInput = {
    where: UsuarioWhereUniqueInput
    update: XOR<UsuarioUpdateWithoutRolesInput, UsuarioUncheckedUpdateWithoutRolesInput>
    create: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput>
  }

  export type UsuarioUpdateWithWhereUniqueWithoutRolesInput = {
    where: UsuarioWhereUniqueInput
    data: XOR<UsuarioUpdateWithoutRolesInput, UsuarioUncheckedUpdateWithoutRolesInput>
  }

  export type UsuarioUpdateManyWithWhereWithoutRolesInput = {
    where: UsuarioScalarWhereInput
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyWithoutRolesInput>
  }

  export type EntidadCreateWithoutAlmacenesInput = {
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioCreateNestedManyWithoutEntidadInput
    roles?: RolCreateNestedManyWithoutEntidadInput
  }

  export type EntidadUncheckedCreateWithoutAlmacenesInput = {
    id?: number
    nombre: string
    tipo: string
    correoContacto: string
    telefono?: string | null
    direccion?: string | null
    fechaCreacion?: Date | string
    usuarios?: UsuarioUncheckedCreateNestedManyWithoutEntidadInput
    roles?: RolUncheckedCreateNestedManyWithoutEntidadInput
  }

  export type EntidadCreateOrConnectWithoutAlmacenesInput = {
    where: EntidadWhereUniqueInput
    create: XOR<EntidadCreateWithoutAlmacenesInput, EntidadUncheckedCreateWithoutAlmacenesInput>
  }

  export type UsuarioAlmacenCreateWithoutAlmacenInput = {
    rolEnAlmacen: string
    permisosExtra?: string | null
    usuario: UsuarioCreateNestedOneWithoutAlmacenesInput
  }

  export type UsuarioAlmacenUncheckedCreateWithoutAlmacenInput = {
    id?: number
    usuarioId: number
    rolEnAlmacen: string
    permisosExtra?: string | null
  }

  export type UsuarioAlmacenCreateOrConnectWithoutAlmacenInput = {
    where: UsuarioAlmacenWhereUniqueInput
    create: XOR<UsuarioAlmacenCreateWithoutAlmacenInput, UsuarioAlmacenUncheckedCreateWithoutAlmacenInput>
  }

  export type UsuarioAlmacenCreateManyAlmacenInputEnvelope = {
    data: UsuarioAlmacenCreateManyAlmacenInput | UsuarioAlmacenCreateManyAlmacenInput[]
    skipDuplicates?: boolean
  }

  export type CodigoAlmacenCreateWithoutAlmacenInput = {
    codigo: string
    rolAsignado: string
    permisos?: string | null
    usosDisponibles?: number | null
    activo?: boolean
    fechaCreacion?: Date | string
    fechaExpiracion?: Date | string | null
    creadoPorId?: number | null
  }

  export type CodigoAlmacenUncheckedCreateWithoutAlmacenInput = {
    id?: number
    codigo: string
    rolAsignado: string
    permisos?: string | null
    usosDisponibles?: number | null
    activo?: boolean
    fechaCreacion?: Date | string
    fechaExpiracion?: Date | string | null
    creadoPorId?: number | null
  }

  export type CodigoAlmacenCreateOrConnectWithoutAlmacenInput = {
    where: CodigoAlmacenWhereUniqueInput
    create: XOR<CodigoAlmacenCreateWithoutAlmacenInput, CodigoAlmacenUncheckedCreateWithoutAlmacenInput>
  }

  export type CodigoAlmacenCreateManyAlmacenInputEnvelope = {
    data: CodigoAlmacenCreateManyAlmacenInput | CodigoAlmacenCreateManyAlmacenInput[]
    skipDuplicates?: boolean
  }

  export type EntidadUpsertWithoutAlmacenesInput = {
    update: XOR<EntidadUpdateWithoutAlmacenesInput, EntidadUncheckedUpdateWithoutAlmacenesInput>
    create: XOR<EntidadCreateWithoutAlmacenesInput, EntidadUncheckedCreateWithoutAlmacenesInput>
    where?: EntidadWhereInput
  }

  export type EntidadUpdateToOneWithWhereWithoutAlmacenesInput = {
    where?: EntidadWhereInput
    data: XOR<EntidadUpdateWithoutAlmacenesInput, EntidadUncheckedUpdateWithoutAlmacenesInput>
  }

  export type EntidadUpdateWithoutAlmacenesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUpdateManyWithoutEntidadNestedInput
    roles?: RolUpdateManyWithoutEntidadNestedInput
  }

  export type EntidadUncheckedUpdateWithoutAlmacenesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    correoContacto?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUncheckedUpdateManyWithoutEntidadNestedInput
    roles?: RolUncheckedUpdateManyWithoutEntidadNestedInput
  }

  export type UsuarioAlmacenUpsertWithWhereUniqueWithoutAlmacenInput = {
    where: UsuarioAlmacenWhereUniqueInput
    update: XOR<UsuarioAlmacenUpdateWithoutAlmacenInput, UsuarioAlmacenUncheckedUpdateWithoutAlmacenInput>
    create: XOR<UsuarioAlmacenCreateWithoutAlmacenInput, UsuarioAlmacenUncheckedCreateWithoutAlmacenInput>
  }

  export type UsuarioAlmacenUpdateWithWhereUniqueWithoutAlmacenInput = {
    where: UsuarioAlmacenWhereUniqueInput
    data: XOR<UsuarioAlmacenUpdateWithoutAlmacenInput, UsuarioAlmacenUncheckedUpdateWithoutAlmacenInput>
  }

  export type UsuarioAlmacenUpdateManyWithWhereWithoutAlmacenInput = {
    where: UsuarioAlmacenScalarWhereInput
    data: XOR<UsuarioAlmacenUpdateManyMutationInput, UsuarioAlmacenUncheckedUpdateManyWithoutAlmacenInput>
  }

  export type CodigoAlmacenUpsertWithWhereUniqueWithoutAlmacenInput = {
    where: CodigoAlmacenWhereUniqueInput
    update: XOR<CodigoAlmacenUpdateWithoutAlmacenInput, CodigoAlmacenUncheckedUpdateWithoutAlmacenInput>
    create: XOR<CodigoAlmacenCreateWithoutAlmacenInput, CodigoAlmacenUncheckedCreateWithoutAlmacenInput>
  }

  export type CodigoAlmacenUpdateWithWhereUniqueWithoutAlmacenInput = {
    where: CodigoAlmacenWhereUniqueInput
    data: XOR<CodigoAlmacenUpdateWithoutAlmacenInput, CodigoAlmacenUncheckedUpdateWithoutAlmacenInput>
  }

  export type CodigoAlmacenUpdateManyWithWhereWithoutAlmacenInput = {
    where: CodigoAlmacenScalarWhereInput
    data: XOR<CodigoAlmacenUpdateManyMutationInput, CodigoAlmacenUncheckedUpdateManyWithoutAlmacenInput>
  }

  export type CodigoAlmacenScalarWhereInput = {
    AND?: CodigoAlmacenScalarWhereInput | CodigoAlmacenScalarWhereInput[]
    OR?: CodigoAlmacenScalarWhereInput[]
    NOT?: CodigoAlmacenScalarWhereInput | CodigoAlmacenScalarWhereInput[]
    id?: IntFilter<"CodigoAlmacen"> | number
    almacenId?: IntFilter<"CodigoAlmacen"> | number
    codigo?: StringFilter<"CodigoAlmacen"> | string
    rolAsignado?: StringFilter<"CodigoAlmacen"> | string
    permisos?: StringNullableFilter<"CodigoAlmacen"> | string | null
    usosDisponibles?: IntNullableFilter<"CodigoAlmacen"> | number | null
    activo?: BoolFilter<"CodigoAlmacen"> | boolean
    fechaCreacion?: DateTimeFilter<"CodigoAlmacen"> | Date | string
    fechaExpiracion?: DateTimeNullableFilter<"CodigoAlmacen"> | Date | string | null
    creadoPorId?: IntNullableFilter<"CodigoAlmacen"> | number | null
  }

  export type UsuarioCreateWithoutAlmacenesInput = {
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    entidad?: EntidadCreateNestedOneWithoutUsuariosInput
    roles?: RolCreateNestedManyWithoutUsuariosInput
  }

  export type UsuarioUncheckedCreateWithoutAlmacenesInput = {
    id?: number
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    entidadId?: number | null
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
    roles?: RolUncheckedCreateNestedManyWithoutUsuariosInput
  }

  export type UsuarioCreateOrConnectWithoutAlmacenesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutAlmacenesInput, UsuarioUncheckedCreateWithoutAlmacenesInput>
  }

  export type AlmacenCreateWithoutUsuariosInput = {
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    entidad: EntidadCreateNestedOneWithoutAlmacenesInput
    codigos?: CodigoAlmacenCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenUncheckedCreateWithoutUsuariosInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    entidadId: number
    codigos?: CodigoAlmacenUncheckedCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenCreateOrConnectWithoutUsuariosInput = {
    where: AlmacenWhereUniqueInput
    create: XOR<AlmacenCreateWithoutUsuariosInput, AlmacenUncheckedCreateWithoutUsuariosInput>
  }

  export type UsuarioUpsertWithoutAlmacenesInput = {
    update: XOR<UsuarioUpdateWithoutAlmacenesInput, UsuarioUncheckedUpdateWithoutAlmacenesInput>
    create: XOR<UsuarioCreateWithoutAlmacenesInput, UsuarioUncheckedCreateWithoutAlmacenesInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutAlmacenesInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutAlmacenesInput, UsuarioUncheckedUpdateWithoutAlmacenesInput>
  }

  export type UsuarioUpdateWithoutAlmacenesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    entidad?: EntidadUpdateOneWithoutUsuariosNestedInput
    roles?: RolUpdateManyWithoutUsuariosNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutAlmacenesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    roles?: RolUncheckedUpdateManyWithoutUsuariosNestedInput
  }

  export type AlmacenUpsertWithoutUsuariosInput = {
    update: XOR<AlmacenUpdateWithoutUsuariosInput, AlmacenUncheckedUpdateWithoutUsuariosInput>
    create: XOR<AlmacenCreateWithoutUsuariosInput, AlmacenUncheckedCreateWithoutUsuariosInput>
    where?: AlmacenWhereInput
  }

  export type AlmacenUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: AlmacenWhereInput
    data: XOR<AlmacenUpdateWithoutUsuariosInput, AlmacenUncheckedUpdateWithoutUsuariosInput>
  }

  export type AlmacenUpdateWithoutUsuariosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    entidad?: EntidadUpdateOneRequiredWithoutAlmacenesNestedInput
    codigos?: CodigoAlmacenUpdateManyWithoutAlmacenNestedInput
  }

  export type AlmacenUncheckedUpdateWithoutUsuariosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: IntFieldUpdateOperationsInput | number
    codigos?: CodigoAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput
  }

  export type AlmacenCreateWithoutCodigosInput = {
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    entidad: EntidadCreateNestedOneWithoutAlmacenesInput
    usuarios?: UsuarioAlmacenCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenUncheckedCreateWithoutCodigosInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
    entidadId: number
    usuarios?: UsuarioAlmacenUncheckedCreateNestedManyWithoutAlmacenInput
  }

  export type AlmacenCreateOrConnectWithoutCodigosInput = {
    where: AlmacenWhereUniqueInput
    create: XOR<AlmacenCreateWithoutCodigosInput, AlmacenUncheckedCreateWithoutCodigosInput>
  }

  export type AlmacenUpsertWithoutCodigosInput = {
    update: XOR<AlmacenUpdateWithoutCodigosInput, AlmacenUncheckedUpdateWithoutCodigosInput>
    create: XOR<AlmacenCreateWithoutCodigosInput, AlmacenUncheckedCreateWithoutCodigosInput>
    where?: AlmacenWhereInput
  }

  export type AlmacenUpdateToOneWithWhereWithoutCodigosInput = {
    where?: AlmacenWhereInput
    data: XOR<AlmacenUpdateWithoutCodigosInput, AlmacenUncheckedUpdateWithoutCodigosInput>
  }

  export type AlmacenUpdateWithoutCodigosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    entidad?: EntidadUpdateOneRequiredWithoutAlmacenesNestedInput
    usuarios?: UsuarioAlmacenUpdateManyWithoutAlmacenNestedInput
  }

  export type AlmacenUncheckedUpdateWithoutCodigosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: IntFieldUpdateOperationsInput | number
    usuarios?: UsuarioAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput
  }

  export type UsuarioCreateManyEntidadInput = {
    id?: number
    nombre: string
    apellidos: string
    correo: string
    contrasena: string
    googleId?: string | null
    tipoCuenta: string
    estado?: string
    fechaRegistro?: Date | string
    codigoUsado?: string | null
    archivoNombre?: string | null
    archivoBuffer?: Uint8Array | null
  }

  export type AlmacenCreateManyEntidadInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    imagenUrl?: string | null
    codigoUnico: string
    funciones?: string | null
    permisosPredeterminados?: string | null
    fechaCreacion?: Date | string
  }

  export type RolCreateManyEntidadInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    permisos: string
  }

  export type UsuarioUpdateWithoutEntidadInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    roles?: RolUpdateManyWithoutUsuariosNestedInput
    almacenes?: UsuarioAlmacenUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutEntidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    roles?: RolUncheckedUpdateManyWithoutUsuariosNestedInput
    almacenes?: UsuarioAlmacenUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateManyWithoutEntidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type AlmacenUpdateWithoutEntidadInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioAlmacenUpdateManyWithoutAlmacenNestedInput
    codigos?: CodigoAlmacenUpdateManyWithoutAlmacenNestedInput
  }

  export type AlmacenUncheckedUpdateWithoutEntidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput
    codigos?: CodigoAlmacenUncheckedUpdateManyWithoutAlmacenNestedInput
  }

  export type AlmacenUncheckedUpdateManyWithoutEntidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    imagenUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codigoUnico?: StringFieldUpdateOperationsInput | string
    funciones?: NullableStringFieldUpdateOperationsInput | string | null
    permisosPredeterminados?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RolUpdateWithoutEntidadInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    usuarios?: UsuarioUpdateManyWithoutRolesNestedInput
  }

  export type RolUncheckedUpdateWithoutEntidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    usuarios?: UsuarioUncheckedUpdateManyWithoutRolesNestedInput
  }

  export type RolUncheckedUpdateManyWithoutEntidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
  }

  export type UsuarioAlmacenCreateManyUsuarioInput = {
    id?: number
    almacenId: number
    rolEnAlmacen: string
    permisosExtra?: string | null
  }

  export type RolUpdateWithoutUsuariosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    entidad?: EntidadUpdateOneWithoutRolesNestedInput
  }

  export type RolUncheckedUpdateWithoutUsuariosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type RolUncheckedUpdateManyWithoutUsuariosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    permisos?: StringFieldUpdateOperationsInput | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type UsuarioAlmacenUpdateWithoutUsuarioInput = {
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
    almacen?: AlmacenUpdateOneRequiredWithoutUsuariosNestedInput
  }

  export type UsuarioAlmacenUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    almacenId?: IntFieldUpdateOperationsInput | number
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsuarioAlmacenUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    almacenId?: IntFieldUpdateOperationsInput | number
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsuarioUpdateWithoutRolesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    entidad?: EntidadUpdateOneWithoutUsuariosNestedInput
    almacenes?: UsuarioAlmacenUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    almacenes?: UsuarioAlmacenUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateManyWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    contrasena?: StringFieldUpdateOperationsInput | string
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCuenta?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    fechaRegistro?: DateTimeFieldUpdateOperationsInput | Date | string
    entidadId?: NullableIntFieldUpdateOperationsInput | number | null
    codigoUsado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    archivoBuffer?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type UsuarioAlmacenCreateManyAlmacenInput = {
    id?: number
    usuarioId: number
    rolEnAlmacen: string
    permisosExtra?: string | null
  }

  export type CodigoAlmacenCreateManyAlmacenInput = {
    id?: number
    codigo: string
    rolAsignado: string
    permisos?: string | null
    usosDisponibles?: number | null
    activo?: boolean
    fechaCreacion?: Date | string
    fechaExpiracion?: Date | string | null
    creadoPorId?: number | null
  }

  export type UsuarioAlmacenUpdateWithoutAlmacenInput = {
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
    usuario?: UsuarioUpdateOneRequiredWithoutAlmacenesNestedInput
  }

  export type UsuarioAlmacenUncheckedUpdateWithoutAlmacenInput = {
    id?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsuarioAlmacenUncheckedUpdateManyWithoutAlmacenInput = {
    id?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    rolEnAlmacen?: StringFieldUpdateOperationsInput | string
    permisosExtra?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CodigoAlmacenUpdateWithoutAlmacenInput = {
    codigo?: StringFieldUpdateOperationsInput | string
    rolAsignado?: StringFieldUpdateOperationsInput | string
    permisos?: NullableStringFieldUpdateOperationsInput | string | null
    usosDisponibles?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaExpiracion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoPorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CodigoAlmacenUncheckedUpdateWithoutAlmacenInput = {
    id?: IntFieldUpdateOperationsInput | number
    codigo?: StringFieldUpdateOperationsInput | string
    rolAsignado?: StringFieldUpdateOperationsInput | string
    permisos?: NullableStringFieldUpdateOperationsInput | string | null
    usosDisponibles?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaExpiracion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoPorId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CodigoAlmacenUncheckedUpdateManyWithoutAlmacenInput = {
    id?: IntFieldUpdateOperationsInput | number
    codigo?: StringFieldUpdateOperationsInput | string
    rolAsignado?: StringFieldUpdateOperationsInput | string
    permisos?: NullableStringFieldUpdateOperationsInput | string | null
    usosDisponibles?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    fechaCreacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaExpiracion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoPorId?: NullableIntFieldUpdateOperationsInput | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}