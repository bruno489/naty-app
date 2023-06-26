export default interface Deslocamento {
  id: number
  kmInicial: number
  inicioDeslocamento: string
  checkList: string
  motivo: string
  observacao: string
  idCondutor: number
  idVeiculo: number
  idCliente: number
  kmFinal: number
  fimDeslocamento: string
}
