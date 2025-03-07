import { replace } from 'connected-react-router';
import { all, put, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import { requestPermission } from '@common/store';

export function* permissionsSaga() {
  yield all([takeLatest(requestPermission.type, requestPermissionsWorker)]);
}

export function* requestPermissionsWorker() {
  yield put(replace(ROUTE_PATHS.REQUEST_PERMISSION));
}
