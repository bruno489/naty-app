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
import Cliente from '@/interfaces/cliente'
import api from '@/services/backendApi'
import { SnackInfos } from '@/interfaces/snackInfos'

interface Props {
  open: boolean
  closeModal: (cliente?: Cliente) => void
}

export const ModalCliente = ({ open, closeModal }: Props): JSX.Element => {
  const [tdClientes, setTdClientes] = useState<Cliente[]>([])
  const [statusSnack, setStatusSnack] = useState<SnackInfos>({
    open: false,
    message: '',
    type: 'success',
  })
  const [idCliente, setIdCliente] = useState<number>()

  useEffect(() => {
    buscarTodosClientes()
  }, [])

  const editarCliente = () => {
    if (!idCliente) {
      setStatusSnack({
        open: true,
        message: 'Selecione o cliente',
        type: 'error',
      })
      return
    }

    closeModal(tdClientes.find(client => client.id === idCliente))
    setIdCliente(undefined)
  }

  const buscarTodosClientes = async () => {
    await api
      .get(`/api/v1/Cliente`)
      .then(result => {
        setTdClientes(result.data)
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao buscar todos clientes.',
          type: 'error',
        })
        console.log(error)
      })
  }

  const deletarCliente = async () => {
    if (!idCliente) {
      setStatusSnack({
        open: true,
        message: 'Selecione o cliente',
        type: 'error',
      })
      return
    }

    await api
      .delete(`/api/v1/Cliente/${idCliente}`)
      .then(() => {
        closeModal()
        setStatusSnack({
          open: true,
          message: 'Cliente deletado com sucesso.',
          type: 'success',
        })
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao deletar cliente.',
          type: 'error',
        })
        console.log(error)
      })

    setIdCliente(undefined)
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
          setIdCliente(undefined)
        }}
      >
        <DialogTitle>Consultar/Deletar cliente</DialogTitle>
        <DialogContent>
          <FormControl style={{ margin: '5px 0' }} fullWidth>
            <InputLabel id="cliente-label">Clientes</InputLabel>
            <Select
              labelId="cliente-label"
              id="cliente"
              label="Clientes"
              style={{ flex: '1' }}
              onChange={(e: SelectChangeEvent) => {
                setIdCliente(Number(e.target.value))
              }}
            >
              {tdClientes.map((clt, idx) => (
                <MenuItem key={idx} value={clt.id}>
                  {clt.nome}
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
            <Button variant="outlined" color="error" onClick={deletarCliente}>
              Deletar
            </Button>
            <Button variant="contained" onClick={editarCliente}>
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
