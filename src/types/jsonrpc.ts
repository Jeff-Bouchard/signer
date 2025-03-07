import type { Infer } from 'superstruct';
import {
  array,
  literal,
  number,
  object,
  optional,
  pattern,
  refine,
  string,
  tuple,
  union
} from 'superstruct';

const Address = pattern(string(), /^0x[a-fA-F0-9]{40}$/);
const Hex = pattern(string(), /^(?:0x)(?:[a-fA-F0-9]+)?$/);
export const EvenHex = refine(Hex, 'Even Length', (value) => value.length % 2 === 0);

export const SignTransactionStruct = tuple([
  object({
    to: optional(Address),
    from: optional(Address),
    nonce: Hex,
    gasLimit: Hex,
    gasPrice: Hex,
    data: EvenHex,
    value: Hex,
    chainId: number()
  })
]);

// @todo Replace with simple `Infer` once superstruct bug is fixed
// https://github.com/ianstormtaylor/superstruct/issues/804
export type TSignTransaction = [
  Omit<Infer<typeof SignTransactionStruct>[0], 'from' | 'to'> & { from?: string; to?: string }
];

export const JSONRPCRequestStruct = object({
  id: union([string(), number()]),
  method: string(),
  jsonrpc: literal('2.0'),
  params: optional(array()),
  signature: string(),
  publicKey: string()
});

export type SignedJsonRPCRequest<T = unknown[]> = Omit<
  Infer<typeof JSONRPCRequestStruct>,
  'params'
> & {
  params?: T;
};

export type JsonRPCRequest<T = unknown[]> = Omit<
  Infer<typeof JSONRPCRequestStruct>,
  'params' | 'publicKey' | 'signature'
> & {
  params?: T;
};

export interface JsonRPCBase {
  id: string | number | null;
}

export type JsonRPCError<Error = unknown> = JsonRPCBase & {
  error: {
    code: string;
    message: string;
    data?: Error;
  };
};

export type JsonRPCResult<Result = unknown> = JsonRPCBase & {
  result: Result;
};

export type JsonRPCResponse<Result = unknown, Error = unknown> =
  | JsonRPCResult<Result>
  | JsonRPCError<Error>;
export type JsonRPCMessage<Result = unknown, Error = unknown> = JsonRPCResponse<Result, Error> & {
  jsonrpc: '2.0';
};
