/// <reference types="react-scripts" />
type Product = {
	height: string;
	width: string;
	depth: string;
	shopifyProductId: string;
	[key: string]: string;
}

type ShopifyCredentials = {
	domain: string;
	storefrontAccessToken: string;
}

declare module '@shopify/buy-button-js';