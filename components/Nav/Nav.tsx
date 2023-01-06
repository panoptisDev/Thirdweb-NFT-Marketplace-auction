import { ConnectWallet } from '@thirdweb-dev/react';
import Link from 'next/link';
import styles from './Nav.module.css';

export function Nav() {
	return (
		<nav className={styles.nav}>
			<Link href='/' className={styles.siteName}>
				Marketplace
			</Link>
			<div className={styles.right}>
				<Link href='/auction' className={styles.linkButton}>
					Create Auction
				</Link>
				<div className={styles.connectWalletContainer}>
					<ConnectWallet />
				</div>
			</div>
		</nav>
	);
}
