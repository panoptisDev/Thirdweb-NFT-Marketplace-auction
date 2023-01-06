/* eslint-disable @next/next/no-img-element */
import { useListing, useContract, Web3Button, useWinningBid } from '@thirdweb-dev/react';
import { ChainId, ListingType, NATIVE_TOKENS } from '@thirdweb-dev/sdk';
import { BigNumber, ethers } from 'ethers';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Aurora } from '../../components/Aurora/Aurora';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { marketplaceContractAddress } from '../../constants';
import { shortenAddress } from '../../lib/shortenAddress';
import styles from '../../styles/Asset.module.css';

const epochSecondsToDate = (epochSeconds: number) => {
	const date = new Date(0);
	date.setUTCSeconds(epochSeconds);
	return date;
};

type Query = { assetId: string };

const ListingPage: NextPage = () => {
	const router = useRouter();
	const { assetId } = router.query as Query;
	const marketplaceContractQuery = useContract(marketplaceContractAddress, 'marketplace');
	const { data: listing, isLoading: loadingListing } = useListing(
		marketplaceContractQuery.contract,
		assetId
	);

	const winningBid = useWinningBid(marketplaceContractQuery.contract, assetId);
	const [bidAmount, setBidAmount] = useState<string>('');

	console.log('listing', listing);

	async function createBidOrOffer() {
		try {
			// If the listing type is a direct listing, then we can create an offer.
			if (listing?.type === ListingType.Direct) {
				await marketplaceContractQuery.contract?.direct.makeOffer(
					assetId, // The listingId of the listing we want to make an offer for
					1, // Quantity = 1
					NATIVE_TOKENS[ChainId.Goerli].wrapped.address, // Wrapped Ether address on Goerli
					bidAmount // The offer amount the user entered
				);
			}

			// If the listing type is an auction listing, then we can create a bid.
			if (listing?.type === ListingType.Auction) {
				await marketplaceContractQuery.contract?.auction.makeBid(assetId, bidAmount);
			}

			alert(`${listing?.type === ListingType.Auction ? 'Bid' : 'Offer'} created successfully!`);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	async function buyOut() {
		try {
			// Simple one-liner for buying the NFT
			await marketplaceContractQuery.contract?.buyoutListing(assetId, 1);
			alert('NFT bought successfully!');
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	return (
		<div className={styles.listingContainer}>
			<Aurora
				size={{ width: '2200px', height: '2200px' }}
				pos={{ left: '25%', top: '30%' }}
				color='hsl(0deg 0% 50% / 22%)'
			/>

			<div>
				{listing ? (
					<img src={listing.asset.image as string} alt='' className={styles.assetImg} />
				) : (
					<Skeleton width='100%' aspectRatio='1/1' />
				)}
			</div>

			<div className={styles.listingInfo}>
				{/* name */}

				<h1 className={styles.assetName}>
					{listing ? listing.asset.name : <Skeleton width='350px' height='50px' />}
				</h1>

				{/* owner */}
				{listing ? (
					<p className={styles.ownerAddress}>
						Owned by
						<em className={styles.address}> {shortenAddress(listing.sellerAddress)}</em>
					</p>
				) : (
					<Skeleton width='250px' height='20px' margin='0 0 50px 0' />
				)}

				<div className={styles.priceSection}>
					{listing ? (
						<p className={styles.price}>
							{listing.buyoutCurrencyValuePerToken.displayValue}{' '}
							{listing.buyoutCurrencyValuePerToken.symbol}{' '}
						</p>
					) : (
						<Skeleton width='200px' height='30px' margin='0 0 20px 0' />
					)}

					{listing && 'reservePrice' in listing && (
						<p className={styles.floorPrice}>
							<span className={styles.priceLabel}> Floor Price </span>{' '}
							{ethers.utils.formatUnits(listing.reservePrice)} MATIC
						</p>
					)}

					{winningBid.isLoading && <Skeleton width='200px' height='20px' margin='0 0 8px 0' />}
					{winningBid.isLoading && <Skeleton width='200px' height='20px' />}

					{!winningBid.isLoading && !winningBid.error && (
						<div className={styles.highestBid}>
							<p>
								<span className={styles.priceLabel}> Highest Bid </span>{' '}
								<span className={styles.highestBidAmmount}>
									{winningBid.data?.currencyValue.displayValue}
									{'  '}
									{winningBid.data?.currencyValue.symbol}
								</span>
							</p>
						</div>
					)}

					{winningBid.error ? <p className={styles.highestBid}> No Bids made yet </p> : ''}
				</div>

				<div className={styles.auctionEnd}>
					{listing && 'endTimeInEpochSeconds' in listing ? (
						<p>
							Auction Ends at{' '}
							{epochSecondsToDate(
								ethers.BigNumber.from(listing.endTimeInEpochSeconds).toNumber()
							).toLocaleString()}
						</p>
					) : (
						<Skeleton width='350px' height='20px' />
					)}
				</div>

				<Web3Button
					className={styles.buyButton}
					action={buyOut}
					contractAddress={marketplaceContractAddress}
				>
					Buy at asking price
				</Web3Button>

				<p className={styles.orSeperator}> OR </p>

				<div className={styles.offerContainer}>
					<input
						type='number'
						className={styles.offerInput}
						onChange={e => setBidAmount(e.target.value)}
						placeholder='Offer'
					/>

					<Web3Button
						className={styles.offerButton}
						contractAddress={marketplaceContractAddress}
						action={createBidOrOffer}
					>
						Place Bid
					</Web3Button>
				</div>
			</div>
		</div>
	);
};

export default ListingPage;
