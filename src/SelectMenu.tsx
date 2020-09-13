import React from "react";

type smProps = {
	i: number;
	selected: string[];
	optionLists: JSX.Element[];
	fields: string[];
	handleChange: ({target: {dataset, value}}: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectMenu: React.FC<smProps> = ({i, selected, optionLists, fields, handleChange}) =>
	<div className="form-group col-12 col-md-3 col-lg-2">
		{/*TODO maybe use id attribute instead of dataset?*/}
		<label className="mr-2"
		       htmlFor={`product${fields[i]}`}>{`${fields[i].charAt(0).toUpperCase()}${fields[i].slice(1)}`}:</label>
		<select required value={selected[i]}
		        onChange={handleChange}
		        data-select-field={fields[i]}
		        data-select-index={i}
		        id={`product${fields[i]}`}
		        className="form-control selectPet">
			<option>select</option>
			{optionLists && optionLists[i]}</select>
	</div>;

export default SelectMenu
