import React, {useEffect, useRef} from "react";
import ShopifyBuy from "@shopify/buy-button-js";

type Props = {
	filteredProductList: Product[];
}

const Shopify: React.FC<Props> = ({filteredProductList}): JSX.Element => {
	const productIds = filteredProductList.map(({shopifyProductId}) => shopifyProductId);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ShopifyBuyInit = () => {
			const client = ShopifyBuy.buildClient({
				domain: 'eden-equipment.myshopify.com',
				storefrontAccessToken: '8f386bb8cf1bc975fc00683937b72d2d',
			});
			const ui = ShopifyBuy.UI.init(client);
			ui.createComponent('productSet', {
				id: [...productIds],
				node: ref.current,
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
		}
		ShopifyBuyInit();
	}, [productIds]);

	return <div ref={ref} id="product-component-1597776212126"/>
}

export default Shopify