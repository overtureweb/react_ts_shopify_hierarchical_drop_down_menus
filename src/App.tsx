import React, {useState, useEffect, useRef, ChangeEvent, FormEvent} from 'react';
import Button from 'react-bootstrap/Button';
import "./App.scss";
import Shopify from "./Shopify";

interface iDataSet extends DOMStringMap {
	selectField: string;
	selectIndex: string;
}

type Props = {
	fields: string[];
}

type AppFil = {
	[key: string]: string;
}

const App: React.FC<Props> = ({fields}) => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [productList, setProductList] = useState();
	const [optionLists, setOptionLists] = useState();
	const [selected, setSelected] = useState(["select", "select", "select"]);
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
			const optionsEls = [...new Set(productList.map((obj: Product) => obj[fields[0]])) as Set<number>].map((value, i): JSX.Element =>
				<option key={`owd${i}`}>{value}</option>);
			setOptionLists([optionsEls, [], []])
		}
		setOptions();
	}, [productList, fields]);

	const handleChange = ({target: {dataset, value}}: ChangeEvent<HTMLSelectElement>) => {
		const {selectField, selectIndex} = dataset as iDataSet;
		const currentIndex: number = +selectIndex;
		const nextIndex: number = +selectIndex + 1;

		//set to false to reset any products already showing
		setIsSubmitted(false);

		setSelected((prevState: string[]) => {
			prevState[currentIndex] = value;
			return prevState.fill("select", nextIndex);
		});

		//update applied filters - store the user-selected option in the appliedFilters ref object
		appliedFilters.current = {...appliedFilters.current, [selectField]: value}

		//delete applied filters - because this is a hierarchical search it's necessary to remove subsequent filters from i + 1 -> end
		for (let i = nextIndex; i < fields.length; i++) {
			delete appliedFilters.current[fields[i]];
		}

		//re-filter products - use the updated appliedFilters to create a new filteredProductList populated with matched items
		filteredProductList.current = productList.filter((product: Product): boolean =>
			Object.entries(appliedFilters.current!).every(([key, value]): boolean => product[key] === value));

		//generate new options - create new option elements
		setOptionLists((prevState: JSX.Element[]) => {
			if (nextIndex >= fields.length) return [...prevState];
			let prev = prevState.slice(0, nextIndex);
			const optionsEls = [...new Set(filteredProductList.current!.map((obj: Product) => +obj[fields[nextIndex]])) as Set<number>]
				.map((value: number, i: number): JSX.Element =>
					<option key={`owd${i}`}>{value}</option>);
			return [...prev, optionsEls];
		})
	}

	const handleReset = () => {
		setSelected(["select", "select", "select"]);
		setIsSubmitted(false);
	}

	const handleSubmit = ((e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		setIsSubmitted(true);
	});

	return (
		<>
			<form onSubmit={handleSubmit} className="hvac__search" id="form">
				<div className="form-row justify-content-center">
					<div className="form-group col-12 col-md-3 col-lg-2">
						<label className="mr-2" htmlFor="productHeight">Height:</label>
						<select value={selected[0]} onChange={handleChange} data-select-field={fields[0]}
						        data-select-index={0}
						        id="productHeight"
						        className="form-control selectPet">
							<option>select</option>
							{optionLists && optionLists[0]}</select>
					</div>
					<div className="form-group col-12 col-md-3 col-lg-2">
						<label className="mr-2" htmlFor="productWidth">Width:</label>
						<select required value={selected[1]} onChange={handleChange} data-select-field={fields[1]}
						        data-select-index={1}
						        id="productWidth"
						        className="form-control selectPet">
							<option>select</option>
							{optionLists && optionLists[1]}</select>
					</div>
					<div className="form-group col-12 col-md-3 col-lg-2">
						<label className="mr-2" htmlFor="productDepth">Depth:</label>
						<select required value={selected[2]} onChange={handleChange} data-select-field={fields[2]}
						        data-select-index={2}
						        id="productDepth"
						        className="form-control selectPet">
							<option>select</option>
							{optionLists && optionLists[2]}</select>
					</div>
					<div style={{whiteSpace: "nowrap"}} className="col-12 col-md-3 align-self-center pt-3 col-lg-3">
						<Button disabled={selected.includes("select")} variant="primary" size="lg" className="mr-2" id="submit"
						        type="submit">search</Button>
						<Button onClick={handleReset} variant="warning" size="lg" id="reset" type="reset">reset</Button>
					</div>
				</div>
			</form>
			{isSubmitted && <Shopify filteredProductList={filteredProductList.current!}/>}
		</>
	)
}

export default App;


