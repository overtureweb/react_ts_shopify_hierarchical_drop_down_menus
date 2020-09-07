import React, {useState, useEffect, useRef, ChangeEvent} from 'react';
import Button from 'react-bootstrap/Button';
import "./App.scss";

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

type Product = {
    height: string;
    width: string;
    depth: string;
    shopifyProductId: string;
    [key: string]: string;
}

const App: React.FC<Props> = ({fields}) => {
    const [productList, setProductList] = useState();
    const [optionLists, setOptionLists] = useState();
    const [selected, setSelected] = useState(["select", "select", "select"]);
    const appliedFilters = useRef<AppFil>();
    const filteredProductList = useRef<object[]>();

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
            const optionsEls = [...(new Set(productList.map((obj: Product) => obj.height))) as Set<number>].map((value, i): JSX.Element =>
                <option key={`owd${i}`}>{value}</option>);
            setOptionLists([optionsEls, [], []])
        }
        setOptions();
    }, [productList]);

    useEffect(() => {

    });

    const handleChange = ({target: {dataset, value}}: ChangeEvent<HTMLSelectElement>) => {
        const {selectField, selectIndex} = dataset as iDataSet;
        const currentIndex: number = +selectIndex;
        const nextIndex: number = +selectIndex + 1;

        setSelected((prevState: string[]) => {
            const newState: string[] = prevState.slice(nextIndex).map(() => "select");
            newState[currentIndex] = value;
            return newState;
        });

        //update applied filters
        appliedFilters.current = {...appliedFilters.current, [selectField]: value}
        //delete applied filters from i + 1 -> end
        for (let i = nextIndex; i < fields.length; i++) {
            delete appliedFilters.current[fields[i]];
        }
        //re-filter products

        filteredProductList.current = productList.filter((product: Product): boolean =>
            Object.entries(appliedFilters.current!).every(([key, value]): boolean => product[key] === value));
        //generate new option els

        setOptionLists((prevState: JSX.Element[]) => {
            if (nextIndex >= fields.length) return [...prevState];
            let prev = prevState.slice(0, nextIndex);
            const optionsEls = [...(new Set(filteredProductList.current!.map((obj: any) => obj[fields[nextIndex]]))) as Set<number>]
                .map((value, i): JSX.Element =>
                    <option key={`owd${i}`}>{value}</option>);
            return [...prev, optionsEls];
        })
    }

    return (
        <form className="hvac__search" id="form">
            <div className="form-row justify-content-center">
                <div className="form-group col-12 col-md-3 col-lg-2">
                    <label className="mr-2" htmlFor="productHeight">Height:</label>
                    <select value={selected[0]} onChange={handleChange} data-select-field="height" data-select-index={0}
                            id="productHeight"
                            className="form-control selectPet">
                        <option>select</option>
                        {optionLists && optionLists[0]}</select>
                </div>
                <div className="form-group col-12 col-md-3 col-lg-2">
                    <label className="mr-2" htmlFor="productWidth">Width:</label>
                    <select value={selected[1]} onChange={handleChange} data-select-field="width" data-select-index={1}
                            id="productWidth"
                            className="form-control selectPet">
                        <option>select</option>
                        {optionLists && optionLists[1]}</select>
                </div>
                <div className="form-group col-12 col-md-3 col-lg-2">
                    <label className="mr-2" htmlFor="productDepth">Depth:</label>
                    <select value={selected[2]} onChange={handleChange} data-select-field="depth" data-select-index={2}
                            id="productDepth"
                            className="form-control selectPet">
                        <option>select</option>
                        {optionLists && optionLists[2]}</select>
                </div>
                <div style={{whiteSpace: "nowrap"}} className="col-12 col-md-3 align-self-center pt-3 col-lg-3">
                    <Button variant="primary" size="lg" disabled className="mr-2" id="submit"
                            type="submit">search</Button>
                    <Button variant="warning" size="lg" id="reset" type="reset">reset</Button>
                </div>
            </div>
        </form>
    )
}

export default App;


