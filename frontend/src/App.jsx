import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from "./services/persons"
import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const addName = (event) => {
    event.preventDefault()
    const person = persons.filter((person) => person.name === newName)
    console.log("adding person:",person)
    if (person.length !== 0){
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(response => {
          console.log(response)
          setPersons(persons.concat(response))
          setErrorMessage(
            `Added ${personObject.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          
          setNewName('')
          setNewNumber('')
          console.log("NEW PERSONS:",persons)
        })
    }
    else{
      //alert(`${newName} is already added to phonebook `+persons.indexOf(newName))
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        //console.log("updating:",id)
        const personToAdd = person[0]
        const updatedPerson = { ...personToAdd, number: newNumber }
        personService
          .update(updatedPerson).then(response => {
            console.log(`${personName} successfully updated${response}`)
            setPersons(persons.filter(p => p.id !== personID))
            console.log("NEW PERSONS:",persons)
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            console.log(error)
            setPersons(persons.filter(person => person.id !== updatedPerson.id))
            setNewName('')
            setNewNumber('')
            setErrorMessage(
              `[ERROR] ${updatedPerson.name} was already deleted from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
        }
    }
  }

  const deletePerson = id => {
    const filteredPerson = persons.filter(p => p.id == id)
    const personName = filteredPerson[0].name
    const personID = filteredPerson[0].id
    console.log("IDS:",id,personID)
    if (window.confirm(`Delete ${personName} ?`)) {
      console.log("id:",id)
      personService
        .deletePerson(personID)
        .then(response => {
          console.log(`${personName} successfully deleted${response}`)
          setPersons(persons.filter(p => p.id !== personID))
          console.log("NEW PERSONS:",persons)
        })
      }
  }

  const handleNameChange = (event) => { setNewName(event.target.value) }

  const handleNumberChange = (event) => { setNewNumber(event.target.value) }

  const handleFilterChange = (event) => { setNewFilter(event.target.value) }
 

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        console.log("SETTING INITIAL PERSONS:",initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <Filter filter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>Add a new </h2>
      <PersonForm addName={addName} name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} handleDelete={deletePerson}/>
      </div>
  )
}

export default App