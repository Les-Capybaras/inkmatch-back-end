export default class DemoService {
  constructor() {
    console.log('DemoService initialized')
  }

  getDemoMessage(): string {
    return 'Hello from DemoService!'
  }
}
