import { Body, Heading } from '@mycrypto/ui';
import { useEffect } from 'react';

import { Account, ScrollableContainer, SignBottom } from '@app/components';
import { useSelector } from '@app/store';
import { getSigningError } from '@common/store';
import { translateRaw } from '@common/translate';
import type { IAccountDeterministic, SignTransactionProps } from '@types';
import { WalletType } from '@types';

import { MnemonicForm, useMnemonicForm } from '../forms/MnemonicForm';

export const SignTransactionMnemonic = (props: SignTransactionProps<IAccountDeterministic>) => {
  const form = useMnemonicForm();

  return <SignTransactionMnemonicForm form={form} {...props} />;
};

const SignTransactionMnemonicForm = ({
  form,
  onAccept,
  currentAccount
}: Pick<SignTransactionProps<IAccountDeterministic>, 'onAccept' | 'currentAccount'> & {
  form: ReturnType<typeof useMnemonicForm>;
}) => {
  const error: string = useSelector(getSigningError);

  useEffect(() => {
    if (form.errorMap['mnemonic'] !== error) {
      form.setError('mnemonic', error);
    }
  }, [error]);

  const handleSubmit = async () => {
    return onAccept({
      walletType: WalletType.MNEMONIC,
      mnemonicPhrase: form.values.mnemonic,
      passphrase: form.values.password,
      path: currentAccount.path!,
      index: currentAccount.index
    });
  };

  return (
    <>
      <ScrollableContainer>
        <Heading fontSize="24px" lineHeight="150%" mb="2" textAlign="center">
          {translateRaw('SIGNING_WITH_NON_PERSISTED_ACCOUNT_HEADER')}
        </Heading>
        <Body mb="3">{translateRaw('SIGNING_WITH_NON_PERSISTED_ACCOUNT_BODY')}</Body>
        <Account
          label={currentAccount.label}
          address={currentAccount.address}
          truncate={false}
          bg="none"
          p="0"
          addressColor="GREY_TEXT"
        />
        <MnemonicForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
      <SignBottom disabled={form.error} form="mnemonic-phrase-form" />
    </>
  );
};
