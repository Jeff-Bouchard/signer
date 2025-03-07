import type { TransactionRequest as EthersTransactionRequest } from '@ethersproject/abstract-provider';
import type { Overwrite } from 'utility-types';

import type { TAddress } from './address';
import type { JsonRPCRequest } from './jsonrpc';
import type { TUuid } from './uuid';

export enum TxResult {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WAITING = 'WAITING'
}

export type TransactionRequest = Overwrite<
  EthersTransactionRequest,
  { to?: TAddress; from: TAddress }
>;

export interface TxHistoryEntry {
  uuid: TUuid;
  tx: TransactionRequest;
  signedTx?: string;
  timestamp: number;
  result: TxResult;
  origin?: string;
  adjustedNonce?: boolean;
  userEdited?: boolean;
  offline?: boolean;
}

export interface TxQueueEntry {
  uuid: TUuid;
  id: JsonRPCRequest['id'];
  tx: TransactionRequest;
  signedTx: undefined;
  timestamp: number;
  result: TxResult.WAITING;
  origin?: string;
  adjustedNonce?: boolean;
  userEdited?: boolean;
  offline?: boolean;
}
