import React, { useRef, useState } from 'react'
import LayoutPainel from '@/components/painel/layoutPainel'
import {
  Alert,
  Button,
  Divider,
  FormControl,
  Snackbar,
  Typography,
} from '@mui/material'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { VTextForm } from '@/components/formComponents/vTextForm'
import api from '@/services/backendApi'
import SearchIcon from '@mui/icons-material/Search'
import { SnackInfos } from '@/interfaces/snackInfos'
import dayjs from 'dayjs'
import { VDatePickerForm } from '@/components/formComponents/vDatePickerForm'
import Condutor from '@/interfaces/condutor'
import { ModalCondutor } from '@/components/condutor/modalCondutor'

export default function CondutorScreen() {
  const formRef = useRef<FormHandles>(null)
  const [openModalCondutor, setOpenModalCondutor] = useState(false)
  const [statusSnack, setStatusSnack] = useState<SnackInfos>({
    open: false,
    message: '',
    type: 'success',
  })

  const submitForm = async (condutor: Condutor) => {
    condutor.vencimentoHabilitacao = dayjs(
      condutor.vencimentoHabilitacao
    ).toISOString()

    if (condutor?.id) {
      await api
        .put(`/api/v1/Condutor/${condutor.id}`, condutor)
        .then(result => {
          setStatusSnack({
            open: true,
            message: 'Condutor editado com sucesso.',
            type: 'success',
          })
          formRef.current?.reset()
          return result.data
        })
        .catch(error => {
          setStatusSnack({
            open: true,
            message: 'Erro ao editar condutor.',
            type: 'error',
          })
          console.error(error)
        })
    } else {
      await api
        .post(`/api/v1/Condutor`, condutor)
        .then(consult => {
          setStatusSnack({
            open: true,
            message: 'Condutor cadastrado com sucesso.',
            type: 'success',
          })
          formRef.current?.reset()
          return consult.data
        })
        .catch(error => {
          console.error(error)
          setStatusSnack({
            open: true,
            message: 'Erro ao cadastrar condutor.',
            type: 'error',
          })
          return undefined
        })
    }
  }

  const fecharModal = (condutor?: Condutor) => {
    if (condutor) {
      condutor.vencimentoHabilitacao = dayjs(condutor.vencimentoHabilitacao)
      formRef.current?.setData(condutor)
    }
    setOpenModalCondutor(false)
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
      <ModalCondutor open={openModalCondutor} closeModal={fecharModal} />
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
          Condutor
        </Typography>
        <Button variant="outlined" onClick={() => setOpenModalCondutor(true)}>
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
          <FormControl style={{ flex: '1' }}>
            <FormControl fullWidth>
              <VTextForm
                required
                label="Nº Habilitação"
                name="numeroHabilitacao"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </FormControl>
          </FormControl>
          <FormControl style={{ width: '130px' }}>
            <VTextForm
              required
              label="Cat. Habilitação"
              name="categoriaHabilitacao"
            />
          </FormControl>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <FormControl fullWidth>
            <VDatePickerForm
              label="Venc. Habilitação"
              name={'vencimentoHabilitacao'}
              defaultValue={dayjs().toDate()}
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

CondutorScreen.getLayout = (page: JSX.Element) => (
  <LayoutPainel>{page}</LayoutPainel>
)
