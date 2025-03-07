import { hexlify } from '@ethersproject/bytes';
import { formatEther, formatUnits, parseEther, parseUnits } from '@ethersproject/units';

import { addHexPrefix, bigify } from '@common/utils';
import type { TransactionRequest } from '@types';

export type HumanReadableTx = ReturnType<typeof toHumanReadable>;

export const toHumanReadable = (tx: TransactionRequest) => ({
  ...tx,
  gasLimit: bigify(tx.gasLimit).toString(10),
  gasPrice: formatUnits(tx.gasPrice, 'gwei'),
  // @todo Consider units
  value: formatEther(tx.value),
  nonce: bigify(tx.nonce).toString(10),
  data: hexlify(tx.data)
});

export const fromHumanReadable = (tx: HumanReadableTx) => ({
  ...tx,
  gasLimit: addHexPrefix(bigify(tx.gasLimit).toString(16)),
  gasPrice: parseUnits(bigify(tx.gasPrice).toString(10), 'gwei').toHexString(),
  // @todo Consider units
  value: parseEther(bigify(tx.value).toString(10)).toHexString(),
  nonce: addHexPrefix(bigify(tx.nonce).toString(16))
});
