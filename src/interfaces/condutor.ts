import dayjs from 'dayjs'

export default interface Condutor {
  id: number
  nome: string
  numeroHabilitacao: string
  categoriaHabilitacao: string
  vencimentoHabilitacao: dayjs.Dayjs | string
}
