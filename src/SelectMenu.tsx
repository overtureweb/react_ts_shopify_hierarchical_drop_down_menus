import React from "react";

type smProps = {
	idx: number;
	selected: string[];
	optionLists: Array<JSX.Element[]>;
	field: string;
	handleChange: ({target: {dataset, value}}: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectMenu: React.FC<smProps> = ({idx, selected, optionLists, field, handleChange}) =>
	<div className="form-group col-12 col-md-3 col-lg-2">
		<label className="mr-2"
		       htmlFor={field}>{`${field.charAt(0).toUpperCase()}${field.slice(1)}`}:</label>
		<select required value={selected[idx]}
		        onChange={handleChange}
		        data-select-index={idx}
		        id={field}
		        className="form-control selectPet">
			<option>select</option>
			{optionLists && optionLists[idx]}</select>
	</div>;

export default SelectMenu
