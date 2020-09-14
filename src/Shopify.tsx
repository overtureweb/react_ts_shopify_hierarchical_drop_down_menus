import React, {useEffect, useRef} from "react";

declare global {
	interface Window {
		ShopifyBuy: any;
	}
}

type Props = {
	filteredProductList: Product[];
}

const Shopify: React.FC<Props> = ({filteredProductList}): JSX.Element => {
	const node = useRef<HTMLDivElement>(null);
	const ShopifyBuyInit = () => {
		const ShopifyBuy = (window as Window).ShopifyBuy
		const client = ShopifyBuy.buildClient({
			domain: 'eden-equipment.myshopify.com',
			storefrontAccessToken: '8f386bb8cf1bc975fc00683937b72d2d',
		});
		const shopifyProductId: string = filteredProductList[0].shopifyProductId;
		ShopifyBuy.UI.onReady(client).then(function (ui: any) {
			ui.createComponent('productSet', {
				id: [shopifyProductId],
				node: node.current,
				moneyFormat: '%24%7B%7Bamount%7D%7D',
				options: {
					"product": {
						"layout": "vertical",
						"styles": {
							"price": {
								"font-size": "2rem"
							},
							"button": {
								"text-transform": "uppercase",
							},
							"product": {
								"text-align": "center",
								"@media (min-width: 601px)": {
									"margin-left": "20px",
									"margin-bottom": "50px"
								}
							}
						},
						"buttonDestination": "checkout",
						"contents": {
							"img": true,
							"title": true,
							"price": true
						},
						"text": {
							"button": "Buy now"
						}
					},
					"productSet": {
						"styles": {
							"products": {
								"@media (min-width: 601px)": {
									"margin-left": "-20px"
								}
							}
						}
					},
					"modalProduct": {
						"contents": {
							"img": false,
							"imgWithCarousel": true,
							"button": false,
							"buttonWithQuantity": true
						},
						"styles": {
							"product": {
								"@media (min-width: 601px)": {
									"max-width": "100%",
									"margin-left": "0px",
									"margin-bottom": "0px"
								}
							}
						},
						"text": {
							"button": "Add to cart"
						}
					},
					"cart": {
						"text": {
							"total": "Subtotal",
							"button": "Checkout"
						}
					}
				},
			});
		});
	}
	//TODO use the NPM package instead!!
	useEffect(() => {
		const loadShopifyScript = () => {
			// if script has already been loaded then just call the Buy Button method
			if (window.ShopifyBuy) return ShopifyBuyInit();
			const scriptURL: string = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
			const script: HTMLScriptElement = document.createElement('script');
			script.async = true;
			script.defer = true;
			script.src = scriptURL;
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
			script.addEventListener("load", () => ShopifyBuyInit());
		}
		loadShopifyScript()
	});

	return <div ref={node} id="product-component-1597776212126"/>

}

export default Shopify