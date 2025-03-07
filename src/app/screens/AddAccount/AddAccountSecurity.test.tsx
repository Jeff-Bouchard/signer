import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { nextFlow } from '@common/store';
import { translateRaw } from '@common/translate';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';

import { AddAccountSecurity } from './AddAccountSecurity';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccountSecurity
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </Router>
  );
};

describe('AddAccountSecurity', () => {
  it('enables the button when scrolled to bottom', async () => {
    const store = createMockStore();
    const { getByText, getByTestId } = getComponent(store);

    const button = getByText(translateRaw('ACKNOWLEDGE_AND_CONTINUE'));

    const wrapper = getByTestId('scroll-wrapper');
    Object.defineProperty(wrapper, 'scrollTop', { configurable: true, value: 0 });
    Object.defineProperty(wrapper, 'scrollHeight', { configurable: true, value: 1 });
    fireEvent.scroll(wrapper);

    fireEvent.click(button);
    expect(store.getActions()).not.toContainEqual(nextFlow());

    Object.defineProperty(wrapper, 'scrollTop', { configurable: true, value: 1 });
    fireEvent.scroll(wrapper);

    fireEvent.click(button);
    expect(store.getActions()).toContainEqual(nextFlow());
  });

  it('enables the button when the window is larger than the content', () => {
    const store = createMockStore();
    const { getByText, getByTestId } = getComponent(store);

    const button = getByText(translateRaw('ACKNOWLEDGE_AND_CONTINUE'));

    const wrapper = getByTestId('scroll-wrapper');
    Object.defineProperty(wrapper, 'scrollHeight', { configurable: true, value: 1 });
    Object.defineProperty(wrapper, 'clientHeight', { configurable: true, value: 1 });
    fireEvent.scroll(wrapper);

    fireEvent.click(button);
    expect(store.getActions()).toContainEqual(nextFlow());
  });
});
