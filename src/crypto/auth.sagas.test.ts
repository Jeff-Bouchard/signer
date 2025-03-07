import { push } from 'connected-react-router';
import keytar from 'keytar';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import {
  createPassword,
  createPasswordSuccess,
  login,
  loginFailed,
  loginSuccess,
  rehydrateAllState,
  resetSettings,
  setNewUser
} from '@common/store';
import { translateRaw } from '@common/translate';
import { KEYTAR_SERVICE } from '@config';
import { fAccount } from '@fixtures';
import { ROUTE_PATHS } from '@routing';

import {
  checkNewUserWorker,
  createPasswordWorker,
  loginWorker,
  logoutWorker,
  resetWorker
} from './auth.sagas';
import {
  checkSettingsKey,
  clearEncryptionKey,
  getSettingsKey,
  hasSettingsKey,
  init
} from './secrets';

jest.mock('./secrets');
jest.mock('keytar');

describe('checkNewUserWorker', () => {
  it('checks if the settings key exists and dispatches setNewUser', async () => {
    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(hasSettingsKey), true]])
      .put(setNewUser(false))
      .silentRun();

    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(hasSettingsKey), false]])
      .put(setNewUser(true))
      .silentRun();
  });
});

describe('loginWorker', () => {
  it('sets the encryption key and logs in', async () => {
    await expectSaga(loginWorker, login('foo'))
      .provide([[call.fn(init), undefined]])
      .provide([[call.fn(checkSettingsKey), true]])
      .call(init, 'foo')
      .call(checkSettingsKey)
      .put(loginSuccess())
      .put(rehydrateAllState())
      .silentRun();
  });

  it('puts an error if the settings key is invalid', async () => {
    await expectSaga(loginWorker, login('foo'))
      .provide([[call.fn(init), undefined]])
      .provide([[call.fn(checkSettingsKey), false]])
      .call(init, 'foo')
      .call(checkSettingsKey)
      .put(loginFailed(translateRaw('LOGIN_ERROR')))
      .silentRun();
  });
});

describe('createPasswordWorker', () => {
  it('sets up the store', async () => {
    (keytar.findCredentials as jest.MockedFunction<
      typeof keytar.findCredentials
    >).mockImplementationOnce(async () => [
      {
        account: fAccount.uuid,
        password: 'foo'
      }
    ]);

    await expectSaga(createPasswordWorker, createPassword('foo'))
      .provide([[call.fn(keytar.findCredentials), [{ account: fAccount.uuid }]]])
      .provide([[call.fn(init), undefined]])
      .provide([[call.fn(getSettingsKey), undefined]])
      .call(init, 'foo')
      .call(getSettingsKey)
      .put(createPasswordSuccess())
      .put(push(ROUTE_PATHS.SETUP_ACCOUNT))
      .silentRun();
  });
});

describe('logoutWorker', () => {
  it('clears the encryption key', async () => {
    await expectSaga(logoutWorker).call(clearEncryptionKey).silentRun();
  });
});

describe('resetWorker', () => {
  it('calls deletePassword on existing credentials', async () => {
    await expectSaga(resetWorker)
      .provide([[call.fn(keytar.findCredentials), [{ account: fAccount.uuid }]]])
      .put(resetSettings())
      .call(keytar.deletePassword, KEYTAR_SERVICE, fAccount.uuid)
      .silentRun();
  });
});
