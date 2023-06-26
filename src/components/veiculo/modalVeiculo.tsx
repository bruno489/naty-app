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
import Veiculo from '@/interfaces/veiculo'

interface Props {
  open: boolean
  closeModal: (veiculo?: Veiculo) => void
}

export const ModalVeiculo = ({ open, closeModal }: Props): JSX.Element => {
  const [tdVeiculos, setTdVeiculos] = useState<Veiculo[]>([])
  const [statusSnack, setStatusSnack] = useState<SnackInfos>({
    open: false,
    message: '',
    type: 'success',
  })
  const [idVeiculo, setIdVeiculo] = useState<number>()

  useEffect(() => {
    buscarTodosVeiculos()
  }, [])

  const editarVeiculo = () => {
    if (!idVeiculo) {
      setStatusSnack({
        open: true,
        message: 'Selecione o veiculo',
        type: 'error',
      })
      return
    }

    closeModal(tdVeiculos.find(veic => veic.id === idVeiculo))
    setIdVeiculo(undefined)
  }

  const buscarTodosVeiculos = async () => {
    await api
      .get(`/api/v1/Veiculo`)
      .then(result => {
        setTdVeiculos(result.data)
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao buscar todos veiculos.',
          type: 'error',
        })
        console.log(error)
      })
  }

  const deletarVeiculo = async () => {
    if (!idVeiculo) {
      setStatusSnack({
        open: true,
        message: 'Selecione o veiculo',
        type: 'error',
      })
      return
    }

    await api
      .delete(`/api/v1/Veiculo/${idVeiculo}`)
      .then(() => {
        closeModal()
        setStatusSnack({
          open: true,
          message: 'Veiculo deletado com sucesso.',
          type: 'success',
        })
        setIdVeiculo(undefined)
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao deletar veiculo.',
          type: 'error',
        })
        console.log(error)
      })
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
          setIdVeiculo(undefined)
        }}
      >
        <DialogTitle>Consultar/Deletar veiculo</DialogTitle>
        <DialogContent>
          <FormControl style={{ margin: '5px 0' }} fullWidth>
            <InputLabel id="veiculo-label">Veiculos</InputLabel>
            <Select
              labelId="veiculo-label"
              id="veiculo"
              label="veiculo"
              style={{ flex: '1' }}
              onChange={(e: SelectChangeEvent) => {
                setIdVeiculo(Number(e.target.value))
              }}
            >
              {tdVeiculos.map((veic, idx) => (
                <MenuItem key={idx} value={veic.id}>
                  {veic.marcaModelo} - {veic.placa}
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
            <Button variant="outlined" color="error" onClick={deletarVeiculo}>
              Deletar
            </Button>
            <Button variant="contained" onClick={editarVeiculo}>
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
