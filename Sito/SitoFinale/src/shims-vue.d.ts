declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module 'process' {
  global {
    var process: any;
  }
} 
declare var H: any;