import React, { useRef, useState } from 'react'
import LayoutPainel from '@/components/painel/layoutPainel'
import {
  Alert,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Snackbar,
  Typography,
} from '@mui/material'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { VTextForm } from '@/components/formComponents/vTextForm'
import api from '@/services/backendApi'
import Cliente from '@/interfaces/cliente'
import { ModalCliente } from '@/components/clientes/modalCliente'
import SearchIcon from '@mui/icons-material/Search'
import { SnackInfos } from '@/interfaces/snackInfos'

export default function Home() {
  const formRef = useRef<FormHandles>(null)
  const [openModalCliente, setOpenModalCliente] = useState(false)
  const [statusSnack, setStatusSnack] = useState<SnackInfos>({
    open: false,
    message: '',
    type: 'success',
  })

  const submitForm = async (cliente: Cliente) => {
    if (cliente?.id) {
      await api
        .put(`/api/v1/Cliente/${cliente.id}`, cliente)
        .then(result => {
          setStatusSnack({
            open: true,
            message: 'Cliente editado com sucesso.',
            type: 'success',
          })
          formRef.current?.reset()
          return result.data
        })
        .catch(error => {
          setStatusSnack({
            open: true,
            message: 'Erro ao editar cliente.',
            type: 'error',
          })
          console.error(error)
        })
    } else {
      await api
        .post(`/api/v1/Cliente`, cliente)
        .then(consult => {
          setStatusSnack({
            open: true,
            message: 'Cliente cadastrado com sucesso.',
            type: 'success',
          })
          formRef.current?.reset()
          return consult.data
        })
        .catch(error => {
          console.error(error)
          setStatusSnack({
            open: true,
            message: 'Erro ao cadastrar cliente.',
            type: 'error',
          })
          return undefined
        })
    }
  }

  const fecharModal = (cliente?: Cliente) => {
    if (cliente) {
      formRef.current?.setData(cliente)
    }
    setOpenModalCliente(false)
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
      <ModalCliente open={openModalCliente} closeModal={fecharModal} />
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
          Cliente
        </Typography>
        <Button variant="outlined" onClick={() => setOpenModalCliente(true)}>
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
        <Divider textAlign="left" style={{ color: 'black' }}>
          Informações pessoais
        </Divider>
        <div style={{ margin: '10px 0' }}>
          <FormControl fullWidth>
            <VTextForm required label="Nome" name="nome" />
          </FormControl>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <FormControl style={{ width: '130px' }}>
            <VTextForm
              id="tipoDocumento"
              name="tipoDocumento"
              label="Documento"
              style={{ flex: '1' }}
              required
              select
            >
              <MenuItem value="RG">RG</MenuItem>
              <MenuItem value="CPF">CPF</MenuItem>
            </VTextForm>
          </FormControl>
          <FormControl style={{ flex: '1' }}>
            <VTextForm
              required
              label="Nº documento"
              name="numeroDocumento"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </FormControl>
        </div>

        <Divider textAlign="left" style={{ color: 'black' }}>
          Endereço
        </Divider>
        <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
          <FormControl style={{ flex: '1' }}>
            <VTextForm required label="Logradouro" name="logradouro" />
          </FormControl>
          <FormControl style={{ width: '120px' }}>
            <VTextForm required label="Número" name="numero" />
          </FormControl>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <FormControl>
            <VTextForm required label="Bairro" name="bairro" />
          </FormControl>
          <FormControl>
            <VTextForm required label="Cidade" name="cidade" />
          </FormControl>
          <FormControl>
            <VTextForm required label="UF" name="uf" />
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

Home.getLayout = (page: JSX.Element) => <LayoutPainel>{page}</LayoutPainel>
