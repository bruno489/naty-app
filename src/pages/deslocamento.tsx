import React, { useEffect, useRef, useState } from 'react'
import LayoutPainel from '@/components/painel/layoutPainel'
import {
  Alert,
  Button,
  FormControl,
  MenuItem,
  Snackbar,
  Typography,
} from '@mui/material'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { VTextForm } from '@/components/formComponents/vTextForm'
import api from '@/services/backendApi'
import { SnackInfos } from '@/interfaces/snackInfos'
import dayjs from 'dayjs'
import { VDatePickerForm } from '@/components/formComponents/vDatePickerForm'
import Condutor from '@/interfaces/condutor'
import Veiculo from '@/interfaces/veiculo'
import Cliente from '@/interfaces/cliente'
import Deslocamento from '@/interfaces/deslocamento'

export default function DeslocamentoScreen() {
  const formRef = useRef<FormHandles>(null)
  const [deslocamento, setDeslocamento] = useState<Deslocamento>()
  const [tdClientes, setTdClientes] = useState<Cliente[]>([])
  const [tdCondutores, setTdCondutores] = useState<Condutor[]>([])
  const [tdVeiculos, setTdVeiculos] = useState<Veiculo[]>([])
  const [statusSnack, setStatusSnack] = useState<SnackInfos>({
    open: false,
    message: '',
    type: 'success',
  })

  useEffect(() => {
    carregarSelects()
  }, [])

  const submitForm = async (desl: Deslocamento) => {
    if (desl.id) {
      desl.fimDeslocamento = dayjs(desl.fimDeslocamento).toISOString()
      await api
        .put(`/api/v1/Deslocamento/${desl.id}/EncerrarDeslocamento`, desl)
        .then(() => {
          setStatusSnack({
            open: true,
            message: 'Deslocamento encerrado com sucesso.',
            type: 'success',
          })
          setDeslocamento(undefined)
        })
        .catch(error => {
          setStatusSnack({
            open: true,
            message: 'Erro ao encerrar deslocamento.',
            type: 'error',
          })
          console.error(error)
        })
    } else {
      desl.inicioDeslocamento = dayjs(desl.inicioDeslocamento).toISOString()
      await api
        .post(`/api/v1/Deslocamento/IniciarDeslocamento`, desl)
        .then(() => {
          setStatusSnack({
            open: true,
            message: 'Deslocamento iniciado com sucesso.',
            type: 'success',
          })
          setDeslocamento(desl)
        })
        .catch(error => {
          console.error(error)
          setStatusSnack({
            open: true,
            message: 'Erro ao iniciar deslocamento.',
            type: 'error',
          })
        })
    }
  }

  const carregarSelects = async () => {
    // getCliente
    await api
      .get(`/api/v1/Cliente`)
      .then(result => {
        setTdClientes(result.data)
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao buscar todos o clientes.',
          type: 'error',
        })
        console.error(error)
      })

    // getCondutores
    await api
      .get(`/api/v1/Condutor`)
      .then(result => {
        setTdCondutores(result.data)
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao buscar todos os condutores.',
          type: 'error',
        })
        console.error(error)
      })

    // getVeiculos
    await api
      .get(`/api/v1/Veiculo`)
      .then(result => {
        setTdVeiculos(result.data)
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao buscar todos os veiculos.',
          type: 'error',
        })
        console.error(error)
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

  const deletarDeslocamento = async () => {
    await api
      .delete(`/api/v1/Cliente/${deslocamento?.id}`)
      .then(() => {
        setDeslocamento(undefined)
        formRef.current?.reset()
        setStatusSnack({
          open: true,
          message: 'Deslocamento deletado com sucesso.',
          type: 'success',
        })
      })
      .catch(error => {
        setStatusSnack({
          open: true,
          message: 'Erro ao deletar deslocamento.',
          type: 'success',
        })
        console.log(error)
      })
  }

  return (
    <>
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
        }}
      >
        <Typography variant="h6" color={'black'}>
          Deslocamento
        </Typography>
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
        {!deslocamento && (
          <>
            <FormControl fullWidth>
              <VTextForm
                id="idCliente"
                name="idCliente"
                label="Cliente"
                required
                select
              >
                {tdClientes.map((client, idx) => (
                  <MenuItem key={idx} value={client.id}>
                    {client.nome}
                  </MenuItem>
                ))}
              </VTextForm>
            </FormControl>
            <div style={{ margin: '10px 0', display: 'flex', gap: '10px' }}>
              <FormControl style={{ flex: '1' }}>
                <VTextForm
                  id="idCondutor"
                  name="idCondutor"
                  label="Condutor"
                  required
                  select
                >
                  {tdCondutores.map((cond, idx) => (
                    <MenuItem key={idx} value={cond.id}>
                      {cond.nome}
                    </MenuItem>
                  ))}
                </VTextForm>
              </FormControl>
              <FormControl style={{ flex: '1' }}>
                <VTextForm
                  id="idVeiculo"
                  name="idVeiculo"
                  label="Veículo"
                  style={{ flex: '1' }}
                  required
                  select
                >
                  {tdVeiculos.map((veic, idx) => (
                    <MenuItem key={idx} value={veic.id}>
                      {veic.marcaModelo} - {veic.placa}
                    </MenuItem>
                  ))}
                </VTextForm>
              </FormControl>
            </div>
          </>
        )}

        <div style={{ margin: '10px 0', display: 'flex', gap: '10px' }}>
          <FormControl style={{ flex: '1' }}>
            <VTextForm
              type="number"
              name={deslocamento ? 'kmFinal' : 'kmInicial'}
              label={deslocamento ? 'km final' : 'Km inicial'}
              defaultValue={0}
            />
          </FormControl>
          <FormControl style={{ flex: '1' }}>
            <VDatePickerForm
              label={`${deslocamento ? 'Final' : 'Inicio'} do deslocamento`}
              name={deslocamento ? 'fimDeslocamento' : 'inicioDeslocamento'}
            />
          </FormControl>
        </div>
        {!deslocamento && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <FormControl style={{ flex: '1' }}>
                <FormControl fullWidth>
                  <VTextForm required label="Checklist" name="checkList" />
                </FormControl>
              </FormControl>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <FormControl fullWidth>
                <VTextForm required label="Motivo" name="motivo" />
              </FormControl>
            </div>
          </>
        )}

        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth>
            <VTextForm
              required
              label="Observação"
              name="observacao"
              multiline
              rows={4}
            />
          </FormControl>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <FormControl fullWidth></FormControl>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'end' }}>
          {deslocamento && (
            <Button
              color="error"
              variant="outlined"
              onClick={deletarDeslocamento}
            >
              Deletar
            </Button>
          )}
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

DeslocamentoScreen.getLayout = (page: JSX.Element) => (
  <LayoutPainel>{page}</LayoutPainel>
)
