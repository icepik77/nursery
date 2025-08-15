declare module 'react-native-open-file' {
  export default {
    open: (uri: string, type?: string) => Promise<void>
  };
}