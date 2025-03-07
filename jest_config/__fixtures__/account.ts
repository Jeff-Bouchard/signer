import { DEFAULT_ETH } from '@mycrypto/wallets';

import type { IAccount, TAddress, TUuid } from '@types';
import { WalletType } from '@types';

export const fAccount: IAccount = {
  uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24' as TUuid,
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  type: WalletType.PRIVATE_KEY,
  persistent: false
};

export const fAccounts: IAccount[] = [
  fAccount,
  {
    uuid: '9b902e45-84be-5e97-b3a8-f937588397b4' as TUuid,
    address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f' as TAddress,
    type: WalletType.MNEMONIC,
    persistent: false,
    path: DEFAULT_ETH,
    index: 0
  },
  {
    uuid: '4175e739-2c60-5717-8e8a-a4f9974dcee2' as TUuid,
    address: '0xF0850b736BB0DE14AE95718569A5032C944e86C8' as TAddress,
    type: WalletType.MNEMONIC,
    persistent: true,
    path: DEFAULT_ETH,
    index: 1
  },
  {
    uuid: '635a7d0a-4865-4f12-aafe-706b6ca6a99d' as TUuid,
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
    type: WalletType.KEYSTORE,
    persistent: false
  }
];
