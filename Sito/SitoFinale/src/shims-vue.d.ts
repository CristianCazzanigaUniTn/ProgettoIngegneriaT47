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
declare module '*.png' {
  const value: string;
  export default value;
}


declare var H: any;

