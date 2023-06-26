import React, { useRef, useState } from 'react'
import LayoutPainel from '@/components/painel/layoutPainel'
import { Alert, Button, FormControl, Snackbar, Typography } from '@mui/material'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { VTextForm } from '@/components/formComponents/vTextForm'
import api from '@/services/backendApi'
import SearchIcon from '@mui/icons-material/Search'
import { SnackInfos } from '@/interfaces/snackInfos'
import Veiculo from '@/interfaces/veiculo'
import { ModalVeiculo } from '@/components/veiculo/modalVeiculo'

export default function VeiculoScreen() {
  const formRef = useRef<FormHandles>(null)
  const [openModalVeiculo, setOpenModalVeiculo] = useState(false)
  const [statusSnack, setStatusSnack] = useState<SnackInfos>({
    open: false,
    message: '',
    type: 'success',
  })

  const submitForm = async (veiculo: Veiculo) => {
    if (veiculo?.id) {
      await api
        .put(`/api/v1/Veiculo/${veiculo.id}`, veiculo)
        .then(result => {
          setStatusSnack({
            open: true,
            message: 'Veiculo editado com sucesso.',
            type: 'success',
          })
          formRef.current?.reset()
          return result.data
        })
        .catch(error => {
          setStatusSnack({
            open: true,
            message: 'Erro ao editar veiculo.',
            type: 'error',
          })
          console.error(error)
        })
    } else {
      await api
        .post(`/api/v1/Veiculo`, veiculo)
        .then(consult => {
          setStatusSnack({
            open: true,
            message: 'Veiculo cadastrado com sucesso.',
            type: 'success',
          })
          formRef.current?.reset()
          return consult.data
        })
        .catch(error => {
          console.error(error)
          setStatusSnack({
            open: true,
            message: 'Erro ao cadastrar veiculo.',
            type: 'error',
          })
          return undefined
        })
    }
  }

  const fecharModal = (veiculo?: Veiculo) => {
    if (veiculo) {
      formRef.current?.setData(veiculo)
    }
    setOpenModalVeiculo(false)
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
      <ModalVeiculo open={openModalVeiculo} closeModal={fecharModal} />
      <Snackbar
        open={statusSnack.open}
        autoHideDuration={6000}
        onClose={fecharSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={fecharSnackBar} severity={statusSnack.type}>
          {statusSnack.message}
        </Alert>
      </Snackbar>
      <div
        style={{
          margin: '0px 10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" color={'black'}>
          Veiculo
        </Typography>
        <Button variant="outlined" onClick={() => setOpenModalVeiculo(true)}>
          <SearchIcon />
        </Button>
      </div>
      <Form
        onSubmit={submitForm}
        ref={formRef}
        style={{
          flex: '1 1 auto',
          width: '100%',
          padding: '0 10px',
        }}
      >
        <VTextForm type="number" name="id" style={{ display: 'none' }} />
        <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
          <FormControl style={{ flex: '1' }}>
            <VTextForm required label="Placa" name="placa" />
          </FormControl>
          <FormControl style={{ flex: '1' }}>
            <VTextForm required label="Marca/Modelo" name="marcaModelo" />
          </FormControl>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <FormControl style={{ flex: '1' }}>
            <VTextForm
              required
              label="Ano de fabricação"
              name="anoFabricacao"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </FormControl>
          <FormControl style={{ flex: '1' }}>
            <VTextForm
              required
              label="Km atual"
              name="kmAtual"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </FormControl>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'end' }}>
          <Button
            variant="outlined"
            onClick={() => {
              formRef.current?.reset()
            }}
          >
            Limpar
          </Button>
          <Button variant="contained" type="submit">
            Enviar
          </Button>
        </div>
      </Form>
    </>
  )
}

VeiculoScreen.getLayout = (page: JSX.Element) => (
  <LayoutPainel>{page}</LayoutPainel>
)
