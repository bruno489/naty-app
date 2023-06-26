import React, { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
} from '@mui/material'
import api from '@/services/backendApi'
import { SnackInfos } from '@/interfaces/snackInfos'
import Condutor from '@/interfaces/condutor'

interface Props {
  open: boolean
  closeModal: (condutor?: Condutor) => void
}

export const ModalCondutor = ({ open, closeModal }: Props): JSX.Element => {
  const [tdCondutores, setTdCondutores] = useState<Condutor[]>([])
  const [statusSnack, setStatusSnack] = useState<SnackInfos>({
    open: false,
    message: '',
    type: 'success',
  })
  const [idCondutor, setIdCondutor] = useState<number>()

  useEffect(() => {
    buscarTodosCondutores()
  }, [])

  const editarCondutor = () => {
    if (!idCondutor) {
      setStatusSnack({
        open: true,
        message: 'Selecione o condutor',
        type: 'error',
      })
      return
    }

    closeModal(tdCondutores.find(condutor => condutor.id === idCondutor))
    setIdCondutor(undefined)
  }

  const buscarTodosCondutores = async () => {
    await api
      .get(`/api/v1/Condutor`)
      .then(result => {
        setTdCondutores(result.data)
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao buscar todos condutores.',
          type: 'error',
        })
        console.log(error)
      })
  }

  const deletarCondutor = async () => {
    if (!idCondutor) {
      setStatusSnack({
        open: true,
        message: 'Selecione o condutor',
        type: 'error',
      })
      return
    }

    await api
      .delete(`/api/v1/Condutor/${idCondutor}`)
      .then(() => {
        closeModal()
        setStatusSnack({
          open: true,
          message: 'Condutor deletado com sucesso.',
          type: 'success',
        })
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao deletar condutor.',
          type: 'error',
        })
        console.log(error)
      })

    setIdCondutor(undefined)
  }

  const fecharSnackBar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return

    setStatusSnack({
      open: false,
      message: statusSnack.message,
      type: statusSnack.type,
    })
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={statusSnack.open}
        autoHideDuration={6000}
        onClose={fecharSnackBar}
        key={1}
      >
        <Alert
          onClose={fecharSnackBar}
          severity={statusSnack.type}
          sx={{ width: '100%' }}
        >
          {statusSnack.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={() => {
          closeModal()
          setIdCondutor(undefined)
        }}
      >
        <DialogTitle>Consultar/Deletar condutor</DialogTitle>
        <DialogContent>
          <FormControl style={{ margin: '5px 0' }} fullWidth>
            <InputLabel id="condutor-label">Condutores</InputLabel>
            <Select
              labelId="condutor-label"
              id="condutor"
              label="condutor"
              style={{ flex: '1' }}
              onChange={(e: SelectChangeEvent) => {
                setIdCondutor(Number(e.target.value))
              }}
            >
              {tdCondutores.map((cond, idx) => (
                <MenuItem key={idx} value={cond.id}>
                  {cond.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px',
              justifyContent: 'end',
            }}
          >
            <Button variant="outlined" color="error" onClick={deletarCondutor}>
              Deletar
            </Button>
            <Button variant="contained" onClick={editarCondutor}>
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
