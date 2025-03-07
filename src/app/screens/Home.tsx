import { Body, Button, Heading } from '@mycrypto/ui';
import { push } from 'connected-react-router';
import { useEffect } from 'react';

import { Box, Container, Image, LinkApp, PanelBottom, TxHistory, TxQueue } from '@app/components';
import wallet from '@assets/icons/home.svg';
import { getAccountsLength, getPersisted, getQueue, getTxHistory } from '@common/store';
import { translateRaw } from '@common/translate';
import { ROUTE_PATHS } from '@routing';
import { useDispatch, useSelector } from '@store';

export const Home = () => {
  const dispatch = useDispatch();
  const accountsLength = useSelector(getAccountsLength);
  const queue = useSelector(getQueue);
  const txHistory = useSelector(getTxHistory);
  const isPersisted = useSelector(getPersisted);

  useEffect(() => {
    if (isPersisted && accountsLength === 0) {
      dispatch(push(ROUTE_PATHS.SETUP_ACCOUNT));
    }
  }, [isPersisted]);

  if (queue.length === 0 && txHistory.length === 0) {
    return (
      <>
        <Container pt="5">
          <Box sx={{ textAlign: 'center' }}>
            <Image alt="Wallet" src={wallet} width="100px" height="100px" />
          </Box>
          <Box maxWidth="80%" mx="auto" sx={{ textAlign: 'center' }}>
            <Heading fontSize="24px" lineHeight="150%" mt="3" mb="2">
              {translateRaw('HOME_EMPTY_HEADER')}
            </Heading>
            <Body variant="muted">{translateRaw('HOME_EMPTY_SUBHEADING')}</Body>
          </Box>
        </Container>
        <PanelBottom variant="clear">
          <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT}>
            <Button variant="inverted" mb="3">
              {translateRaw('ADD_ANOTHER_ACCOUNT')}
            </Button>
          </LinkApp>
          <LinkApp href={ROUTE_PATHS.LOAD_UNSIGNED_TRANSACTION}>
            <Button variant="inverted">{translateRaw('PASTE_UNSIGNED_TRANSACTION')}</Button>
          </LinkApp>
        </PanelBottom>
      </>
    );
  }

  return (
    <Container>
      <TxQueue queue={queue} />
      <TxHistory history={txHistory} />
    </Container>
  );
};
