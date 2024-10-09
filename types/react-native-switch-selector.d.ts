declare module 'react-native-switch-selector' {
    import { ViewStyle } from 'react-native';
  
    interface Option {
      label: string;
      value: any;
    }
  
    interface SwitchSelectorProps {
      options: Option[];
      initial?: number;
      onPress?: (value: any) => void;
      textColor?: string;
      selectedColor?: string;
      buttonColor?: string;
      backgroundColor?: string;
      borderColor?: string;
      hasPadding?: boolean;
      disabled?: boolean;
      fontSize?: number;
      bold?: boolean;
      style?: ViewStyle;
      returnObject?: boolean;
    }
  
    export default function SwitchSelector(props: SwitchSelectorProps): JSX.Element;
}
