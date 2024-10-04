import Person from "./Person"
const Persons = ({persons,filter,handleDelete}) =>{
    //console.log("persons:",persons,filter)
    const filteredPeople = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) || person.number.includes(filter))
    //console.log("filtered people", filteredPeople)

    return(
        <div>{filteredPeople.map(person => <Person key={person.id} person={person} handleDelete={handleDelete} />)}</div>
        
    )
}

export default Persons

//const personAfterFilter = filter.map( props => <People key={props.id} name={props.name} number={props.number} id={props.id} />) 