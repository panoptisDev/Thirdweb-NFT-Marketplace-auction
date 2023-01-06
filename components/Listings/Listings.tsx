/* eslint-disable @next/next/no-img-element */
import { useActiveListings, useContract } from '@thirdweb-dev/react';
import styles from './Listings.module.css';
import { marketplaceContractAddress } from '../../constants';
import { useRouter } from 'next/router';
import { ListingItemSkeleton } from './ListingItemSkeleton';

const Skeletons = new Array(8).fill(0).map((_, i) => <ListingItemSkeleton key={i} />);

export function Listings() {
	const router = useRouter();
	const marketplaceContractQuery = useContract(marketplaceContractAddress, 'marketplace');
	const activeListingsQuery = useActiveListings(marketplaceContractQuery.contract);

	return (
		<section className={styles.listingSection}>
			<h2 className={styles.listingSectionTitle}> NFTs on Auction </h2>
			<div className={styles.listingGrid}>
				{activeListingsQuery.isLoading
					? Skeletons
					: activeListingsQuery.data?.map(listing => {
							return (
								<div
									key={listing.asset.id}
									className={styles.listingCard}
									onClick={() => router.push(`/assets/${listing.id}`)}
								>
									<div className={styles.assetImgContainer}>
										<img src={listing.asset.image as string} alt='' />
									</div>

									<div className={styles.listingCardInfo}>
										<p className={styles.assetName}>{listing.asset.name}</p>
										{/* <p className={styles.assetId}>#{listing.asset.id}</p> */}
										{/* <p> Seller : {listing.sellerAddress}</p> */}
										<p className={styles.assetPrice}>
											{' '}
											{listing.buyoutCurrencyValuePerToken.displayValue}{' '}
											{listing.buyoutCurrencyValuePerToken.symbol}
										</p>

										{/* {'reservePriceCurrencyValuePerToken' in listing && (
										<p>
											Reserve price :{listing.reservePriceCurrencyValuePerToken.displayValue}
											{listing.buyoutCurrencyValuePerToken.symbol}
										</p>
									)}

									{'endTimeInEpochSeconds' in listing && (
										<p>
											End Time:
											{new Date(
												BigNumber.from(listing.endTimeInEpochSeconds).toNumber()
											).toLocaleString()}{' '}
										</p>
									)}

									{'startTimeInEpochSeconds' in listing && (
										<p>
											Start Time:
											{new Date(
												BigNumber.from(listing.startTimeInEpochSeconds).toNumber()
											).toLocaleString()}{' '}
										</p>
									)} */}
									</div>
								</div>
							);
					  })}
			</div>
		</section>
	);
}
