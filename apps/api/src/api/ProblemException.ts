class ProblemException extends Error {
  public detail?: string
  public instance?: string
  public status: number
  public title: string
  public type?: string

  statusCode: number
  constructor(opts: {
    title: string
    status: number
    instance?: string
    detail?: string
    type?: string
  }) {
    super(opts.title)
    this.title = opts.title
    this.instance = opts.instance
    this.detail = opts.detail
    this.type = opts.type
    this.status = opts.status
    this.statusCode = opts.status
  }
}

export function isProblemException(err: any): err is ProblemException {
  return err instanceof ProblemException
}

export default ProblemException
