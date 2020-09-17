#React/Shopify Hierarchical Select Menus

This project is a working example of a series of hierarchical HTML select menus used to narrow a product search to a single item. This example uses the product dimensions as the search criteria. Once all the options have been chosen the user clicks the submit button and the product ID is passed to the Shopify script which returns and displays the appropriate product with a buy now button.

A working example can be found here:
https://www.overtureweb.com/react-shopify-hierarchical-select-menus

Please note this library is provided “as-is” with limited support. We are available to adapt and integrate this library into your project and for broader development needs. For more information contact us [here](https://www.overtureweb.com/contact-us/).

###Requirements

**React/Typescript**  
This project uses the React library with Typescript and was initialized using Create React App.

**Shopify Buy Button**  
The Shopify Store must have Buy Button installed as an active sales channel and all products to be included in the search results must be enabled for this sales channel. 

**Shopify Buy Button Javascript**  
The documentation can be found [here](http://shopify.github.io/buy-button-js/) and the script can be installed as an [NPM package](https://www.npmjs.com/package/@shopify/buy-button-js). This library is used to make requests to a Shopify store, display products with a Buy Now button and provide an integrated checkout process.

This project optionally uses React Bootstrap for a simple responsive layout and clean UI.


**Configuration**  
You will need a data object that contains the searchable parameters as well as the Shopify Product ID. The data is organized as a JSON array of product options. Here’s a snippet from our working example:  

    [  
        {
            "height": "14",
            "width": "25",
            "depth": "2",
            "shopifyProductId": "4796708618311"
        },
        {
            "height": "15",
            "width": "20",
            "depth": "2",
            "shopifyProductId": "4796707864647"
        }
    ]

The React <App/> component takes two properties:

1. An array of the properties you want to search by and because this is a hierarchical search they must be in the exact desired order (ie, height, width, depth)  
2. A Shopify object which contains two properties: first, the Shopify store domain (ie. store.myshopify.com) and second, the storefront access token. Both of these values can be obtained through the Private App settings in the Shopify Admin

The App component first makes a fetch() for the data. Our example uses data from a JSON array in the project’s public folder but can be adapted to fetch from any external source (ie database). This data is then used to create the first drop down menu using the first item in the array that was passed. When a user makes a selection from the drop-down list a change event fires, the product data is filtered to include only those entries that match the user’s selection and the next drop-down menu is populated with options from the filtered product data list.

When the user clicks submit the product ID is passed to the Shopify component which uses it to generate and display a Buy Now button. The ui.createComponent method takes an _options_ object that contains configuration and styling instructions for the Buy Now button. Refer to the Shopify documentation here for more information.

***

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
