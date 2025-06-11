import { useState, useCallback } from 'react';

type ValidationRule<T> = (value: any, values: T) => string | undefined;
type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Touched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      const rules = validationRules[name];
      if (!rules) return '';
      for (const rule of rules) {
        const error = rule(value, values);
        if (error) return error;
      }
      return '';
    },
    [validationRules, values]
  );

  const validateAll = useCallback(() => {
    const newErrors: Errors<T> = {};
    let isValid = true;
    (Object.keys(validationRules) as (keyof T)[]).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  }, [validateField, values, validationRules]);

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({
        ...prev,
        [name]: value
      }));
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    },
    [touched, validateField]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      let fieldValue: any = value;
      if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        fieldValue = e.target.checked;
      }
      handleChange(name as keyof T, fieldValue);
    },
    [handleChange]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
      const error = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    },
    [validateField, values]
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      handleBlur(e.target.name as keyof T);
    },
    [handleBlur]
  );

  const reset = useCallback(
    (newValues: T = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      handleChange(name, value);
    },
    [handleChange]
  );

  const setFieldError = useCallback(
    (name: keyof T, error: string) => {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      setIsSubmitting(true);
      const allFieldsTouched: Touched<T> = {};
      (Object.keys(validationRules) as (keyof T)[]).forEach(fieldName => {
        allFieldsTouched[fieldName] = true;
      });
      setTouched(allFieldsTouched);
      const isValid = validateAll();
      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Erreur lors de la soumission:', error);
        }
      }
      setIsSubmitting(false);
      return isValid;
    },
    [values, validateAll, validationRules]
  );

  const isValid =
    Object.keys(errors).length === 0 &&
    (Object.keys(validationRules) as (keyof T)[]).every(
      field => validateField(field, values[field]) === ''
    );

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleInputChange,
    handleBlur,
    handleInputBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
    validateAll
  };
};