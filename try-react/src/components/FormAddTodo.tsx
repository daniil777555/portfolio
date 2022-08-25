import React, { useState, useContext } from 'react'
import { SnackBarContext } from '../context/snack-bar'
import { useActions } from '../hooks/store-hooks'
import { ISnackBarEnum } from '../types/ISnackBarEnum'
import { validationRules } from '../utils/validation-rules'
import { AppInput } from './AppInput'

export function FormAddTodo() {
  const { setText: setSBText, setComponentType, open, setWithError, setTimed, setTime } = useContext(SnackBarContext)
  const { pushTodo } = useActions()
  const [text, setText] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const rules = [
    validationRules.required,
    validationRules.minLength3
  ]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate(text.trim())) {
      setWithError(true)
      setTimed(true)
      setTime(2000)
      setComponentType(ISnackBarEnum.ALERT)
      setSBText("Something went wrong :(")
      open()
      return
    }
    pushTodo({
      title: text,
      userId: Date.now(),
      id: Date.now() + Math.round(Math.random() * 100),
      completed: completed
    })
    setText('')
    setTimed(true)
    setTime(2000)
    setCompleted(false)
    setComponentType(ISnackBarEnum.ALERT)
    setSBText("Todo added successfuly")
    open()
  }

  const validate = (val: string) => {
    for (let rule of rules) {
      const res = rule(val)
      if (typeof res === 'string') {
        setError(res)
        return false
      }
    }
    setError('')
    return true
  }

  return (
    <form
      onSubmit={submit}
      className="px-5 py-5 max-w-md mx-auto bg-slate-700 shadow-md shadow-gray-600 rounded-xl mb-8">
      <AppInput
        model={text}
        validate={validate}
        setText={setText}
        error={error}
      />
      <div className="flex pt-3">
        <label
          htmlFor="checkboxInput"
          className="text-md select-none mr-2">
          Complited
        </label>
        <input
          type="checkbox"
          name="checkboxInput"
          id="checkboxInput"
          checked={completed}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompleted(e.target.checked)
          }
        />
      </div>
      <button
        type="submit"
        className={`
          btn text-sm mt-4
          bg-yellow-500
          text-gray-200
          hover:bg-yellow-600
          px-4 py-2
          rounded-md w-full`}>
        Add
      </button>
    </form>
  )
}
