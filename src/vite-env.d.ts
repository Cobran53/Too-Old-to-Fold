/// <reference types="vite/client" />
declare module '*.yaml' {
  const data: any; // Or use a more specific type if you have one defined
  export default data;
}