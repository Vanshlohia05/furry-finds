import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';

test('renders Aww Range brand in storefront header', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await waitFor(() => expect(screen.getByText(/Aww Range/i)).toBeInTheDocument());
});
