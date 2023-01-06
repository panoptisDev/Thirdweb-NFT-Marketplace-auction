export const shortenAddress = (str?: string) => {
	if (!str) {
		return '';
	}
	if (str.length > 13) {
		return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
	} else {
		return str;
	}
};
