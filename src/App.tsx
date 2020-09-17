import React, {useState, useEffect, useRef, ChangeEvent, FormEvent} from 'react';
import Button from 'react-bootstrap/Button';
import "./App.scss";
import Shopify from "./Shopify";
import {v4 as uuidv4} from 'uuid';
import SelectMenu from "./SelectMenu";
import {Col, Container, Row} from "react-bootstrap";

interface iDataSet extends DOMStringMap {
	selectField: string;
	selectIndex: string;
}

type Props = {
	fields: string[];
	shopifyCredentials: ShopifyCredentials;
}

type AppFil = {
	[key: string]: string;
}

const App: React.FC<Props> = ({fields, shopifyCredentials}) => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [productList, setProductList] = useState([]);
	const [optionLists, setOptionLists] = useState<Array<JSX.Element[]>>([]);
	// need to keep track of the currently selected option, defaults to "select"
	const [selected, setSelected] = useState(Array(fields.length).fill("select"));
	const appliedFilters = useRef<AppFil>();
	const filteredProductList = useRef<Product[]>();

	// called once to get the product data
	useEffect(() => {
		const getProductList = async () => {
			try {
				const url: string = `${process.env.PUBLIC_URL}/products.json`;
				const response = await fetch(url);
				const json = await response.json();
				setProductList(json);
			} catch (err) {
				console.log(`An error occurred: ${err}`);
			}
		}
		getProductList().then();
	}, []);

	useEffect(() => {
		const setOptions = () => {
			if (!productList) return;
			//generate the option list for the first drop-down
			const optionsEls: JSX.Element[] = [...new Set(productList.map((obj: Product) => obj[fields[0]]))].map((value, i): JSX.Element =>
				<option key={`owd${i}`}>{value}</option>);
			setOptionLists([optionsEls, [], []])
		}
		setOptions();
	}, [productList, fields]);

	const handleChange = ({target: {dataset, value, id}}: ChangeEvent<HTMLSelectElement>): void => {
		const {selectIndex} = dataset as iDataSet;
		const currentIndex: number = +selectIndex;
		const nextIndex: number = +selectIndex + 1;

		//set to false to reset any products already showing
		setIsSubmitted(false);

		setSelected((prevState: string[]) => {
			prevState[currentIndex] = value;
			// select menus are hierarchical so when a parent changes, need to set descendents back to default of "select"
			return prevState.fill("select", nextIndex);
		});

		//update applied filters - store the user-selected option in the appliedFilters ref object
		appliedFilters.current = {...appliedFilters.current, [id]: value}

		//delete applied filters - because this is a hierarchical search it's necessary to remove subsequent filters from i + 1 -> end
		for (let i = nextIndex; i < fields.length; i++) {
			delete appliedFilters.current[fields[i]];
		}

		//re-filter products - use the updated appliedFilters to create a new filteredProductList populated with matched items
		filteredProductList.current = productList.filter((product: Product): boolean =>
			Object.entries(appliedFilters.current!).every(([key, value]): boolean => product[key] === value));

		//generate new options - create new option elements
		setOptionLists((prevState) => {
			if (nextIndex >= fields.length) return [...prevState];
			let prev = prevState.slice(0, nextIndex);
			const optionsEls = [...new Set(filteredProductList.current!.map((obj: Product) => +obj[fields[nextIndex]])) as Set<number>]
				.map((value: number, i: number): JSX.Element =>
					<option key={`owd${i}`}>{value}</option>);
			return [...prev, optionsEls];
		});
	}

	const handleReset = () => {
		// clear currently selected values which disables the submit button
		setSelected(["select", "select", "select"]);
		// resets the submitted status which removes the Shopify component
		setIsSubmitted(false);
	}

	const handleSubmit = ((e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		setIsSubmitted(true);
	});

	return (
		<Container>
			<Row className="justify-content-center mt-5 pt-5">
				<Col>
					<h1 className="text-center">Find Your Filter</h1>
					<form onSubmit={handleSubmit} className="hvac__search" id="form">
						<div className="form-row justify-content-center">
							{fields.map((field, idx) =>
								<SelectMenu
									idx={idx}
									key={uuidv4()}
									handleChange={handleChange}
									field={field}
									selected={selected}
									optionLists={optionLists}
								/>
							)}
							<div style={{whiteSpace: "nowrap"}}
							     className="col-12 col-md-3 align-self-center pt-3 col-lg-3">
								<Button variant="primary"
								        size="lg"
									// uncomment the next line to constrain the user to select a value for all 3 fields
									// disabled={selected.includes("select")}
									    className="mr-2"
									    id="submit"
									    type="submit">search</Button>
								<Button onClick={handleReset} variant="warning" size="lg" id="reset"
								        type="reset">reset</Button>
							</div>
						</div>
					</form>
					{isSubmitted && <Shopify filteredProductList={filteredProductList.current!} shopifyCredentials={shopifyCredentials}/>}</Col>
			</Row>
		</Container>
	)
}

export default App;


