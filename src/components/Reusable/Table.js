// -----------------------------------------------
//
// Desc: Table to help set up UI grid
//
// -----------------------------------------------

export default function Table(props) {
	const { grid, id } = props;

	return (
		<div className='table' id={id}>
			<div className='grid-container'>
					{grid}
			</div>
		</div>
	);
};