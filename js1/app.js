class App { 
  constructor(container) {
    this.containeeer=container;
    this.containeeer.className='app';
    this.caixa=new Caixa(this.containeeer);
  }
}

const container = document.querySelector('#app');
const app = new App(container);