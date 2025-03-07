import { Body } from '@mycrypto/ui';
import { push } from 'connected-react-router';

import {
  Box,
  FromToAccount,
  Image,
  LinkApp,
  ScrollableContainer,
  TimeElapsed,
  TransactionBottom,
  TxDetails,
  TxInfoBanner
} from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import edit from '@assets/icons/edit.svg';
import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  getTransactionInfoBannerType,
  sign
} from '@common/store';
import { translateRaw } from '@common/translate';
import { TxResult } from '@types';

export const Transaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const currentTx = useSelector(getCurrentTransaction);
  const { tx, timestamp, result, origin } = currentTx;
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const recipientAccount = tx && accounts.find((a) => a.address === tx.to);
  const info = useSelector(getTransactionInfoBannerType);

  const handleAccept = () => {
    if (currentAccount?.persistent) {
      dispatch(
        sign({
          wallet: {
            persistent: true,
            uuid: currentAccount.uuid
          },
          tx
        })
      );
    } else {
      dispatch(push(ROUTE_PATHS.SIGN_TX));
    }
  };

  const handleDeny = () => {
    dispatch(denyCurrentTransaction());
  };

  return (
    <>
      <ScrollableContainer>
        <Box>
          <TxInfoBanner type={info} />
          <FromToAccount
            sender={{ address: tx.from, label: currentAccount?.label }}
            recipient={tx.to && { address: tx.to, label: recipientAccount?.label }}
          />
          <Box variant="horizontal-start">
            <Body fontSize="14px" color="BLUE_GREY" mb="2" mt="2">
              {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
              <TimeElapsed value={timestamp} />
            </Body>
            {result === TxResult.WAITING && (
              <LinkApp
                href={ROUTE_PATHS.EDIT_TX}
                variant="barren"
                ml="auto"
                height="20px"
                width="20px"
              >
                <Image src={edit} height="20px" width="20px" />
              </LinkApp>
            )}
          </Box>
          <TxDetails tx={currentTx} />
        </Box>
      </ScrollableContainer>
      {result === TxResult.WAITING && (
        <TransactionBottom disabled={false} handleAccept={handleAccept} handleDeny={handleDeny} />
      )}
    </>
  );
};
