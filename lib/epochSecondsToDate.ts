export const epochSecondsToDate = (epochSeconds: number) => {
	const date = new Date(0);
	date.setUTCSeconds(epochSeconds);
	return date;
};
