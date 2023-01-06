import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { Nav } from '../components/Nav/Nav';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThirdwebProvider desiredChainId={ChainId.Mumbai}>
			<div style={{ overflow: 'hidden', position: 'relative', minHeight: '100vh' }}>
				<Nav />
				<Component {...pageProps} />
			</div>
		</ThirdwebProvider>
	);
}
