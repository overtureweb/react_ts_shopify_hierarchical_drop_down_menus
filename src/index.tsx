import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
	<React.StrictMode>
		<App
			fields={["height", "width", "depth"]}
			shopifyCredentials={{
				domain: "eden-equipment.myshopify.com",
				storefrontAccessToken: "8f386bb8cf1bc975fc00683937b72d2d"
			}}/>
	</React.StrictMode>,
	document.getElementById('root')
);

