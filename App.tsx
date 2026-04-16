import { ShortlistProvider } from './src/hooks/useShortlist';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ShortlistProvider>
      <AppNavigator />
    </ShortlistProvider>
  );
}
