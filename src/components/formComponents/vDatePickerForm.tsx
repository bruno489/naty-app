import React, { useEffect, useState } from 'react'
import { useField } from '@unform/core'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers'

type TVDatePickerFormProps = DatePickerProps<Date> & {
  name: string
  label: string
}
export const VDatePickerForm: React.FC<TVDatePickerFormProps> = ({
  name,
  label,
  ...rest
}) => {
  const { fieldName, registerField, defaultValue } = useField(name)

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
      clearValue: () => setValue(null),
    })
  }, [registerField, value, fieldName])

  return (
    <>
      <DatePicker
        {...rest}
        label={label}
        defaultValue={defaultValue}
        value={value}
        onChange={e => {
          setValue(e)
        }}
        format="DD/MM/YYYY"
      />
    </>
  )
}
