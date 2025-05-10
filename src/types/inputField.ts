export interface InputFieldProps {
    label: string;
    type?: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required: boolean;
  }
