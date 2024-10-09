import { useState, useEffect } from 'react'
import Filter from './components/filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from "./services/persons"
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)

  const addName = (event) => {
    event.preventDefault()
    const checkPerson = persons.filter((person) => person.name === newName)
    console.log("checking person:",checkPerson,checkPerson.length == 0)

    const personToAdd = checkPerson[0]
    const updatedPerson = { ...personToAdd, number: newNumber }

    if (checkPerson.length !==0){
      if (window.confirm(`${personToAdd.name} is already added to the phonebook, replace the old number with a new one ?`)){
        personService
          .update(updatedPerson.id,updatedPerson).then(returnedPerson => {
            console.log(`${returnedPerson.name} successfully updated`)
            setPersons(persons.map(personItem => personItem.id !== personToAdd.id ? personItem : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(
              `${updatedPerson.name} was successfully updated`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch((error) => {
            console.log(error)
            setPersons(persons.filter(person => person.id !== updatedPerson.id))
            setNewName('')
            setNewNumber('')
            setMessage(
              `[ERROR] ${updatedPerson.name} was already deleted from server`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else{
      const personToAdd = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personToAdd)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(
            `${newName} was successfully added`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(
            `[ERROR] ${error.response.data.error}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          console.log(error.response.data)
        })
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
          setMessage(
            `${personName} was successfully deleted`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
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
      <Notification message={message}/>
      <Filter filter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>Add a new </h2>
      <PersonForm addName={addName} name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} handleDelete={deletePerson}/>
      </div>
  )
}

export default App