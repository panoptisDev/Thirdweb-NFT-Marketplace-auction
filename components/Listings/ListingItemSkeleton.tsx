import styles from './ListingItemSkeleton.module.css';

export function ListingItemSkeleton() {
	return (
		<div className={styles.skeleton}>
			<div className={`${styles.loading} ${styles.loadingImg}`}></div>
		</div>
	);
}
