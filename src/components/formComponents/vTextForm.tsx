import React, { useEffect, useState } from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { useField } from '@unform/core'

type TVTextFormProps = TextFieldProps & {
  name: string
}
export const VTextForm: React.FC<TVTextFormProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error } = useField(name)

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
      clearValue: () => setValue(''),
    })
  }, [registerField, value, fieldName])

  return (
    <TextField
      {...rest}
      value={value || ''}
      onChange={e => setValue(e.target.value)}
      helperText={error ? 'Por favor, preencha este campo.' : undefined}
      error={!!error}
      defaultValue={defaultValue}
    />
  )
}
