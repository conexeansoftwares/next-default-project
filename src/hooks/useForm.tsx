import { useState, useCallback } from 'react';

/**
 * Defines a validation rule function type.
 * @template T The type of the value being validated.
 */
type ValidationRule<T> = (value: T) => string | true;

/**
 * Defines the configuration for a single form field.
 * @template T The type of the field value.
 */
interface FieldConfig<T> {
  initialValue: T;
  validations: ValidationRule<T>[];
}

/**
 * Defines the configuration for the entire form.
 */
type FormConfig<T> = {
  [K in keyof T]: FieldConfig<T[K]>;
};

/**
 * Defines the shape of a change event, which can be either a React change event
 * or a custom object with name and value properties.
 */
type ChangeEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  | { name: string; value: unknown };

/**
 * A custom hook for managing form state, including validation and submission.
 *
 * @param {FormConfig} config - The configuration object for the form fields.
 * @returns An object containing form state and utility functions.
 */
export const useForm = <T extends Record<string, unknown>>(config: FormConfig<T>) => {
  // Initialize form data based on the provided configuration
  const initialFormData = Object.keys(config).reduce(
    (acc, name) => {
      acc[name as keyof T] = config[name as keyof T].initialValue;
      return acc;
    },
    {} as T,
  );

  const [formData, setFormData] = useState<T>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting] = useState<boolean>(false);

  /**
   * Validates a single field.
   *
   * @param {keyof T} name - The name of the field to validate.
   * @param {T[keyof T]} value - The value of the field to validate.
   * @returns {string} An error message if validation fails, or an empty string if validation passes.
   */
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      const field = config[name];
      if (!field) return '';

      for (const validation of field.validations) {
        const result = validation(value);
        if (typeof result === 'string') {
          return result;
        }
      }
      return '';
    },
    [config],
  );

  /**
   * Handles changes to form fields.
   *
   * @param {ChangeEvent} e - The change event.
   */
  const handleChange = (e: ChangeEvent) => {
    const { name, value } =
      'target' in e ? e.target : e;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name as keyof T, value as T[keyof T]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /**
   * Validates the entire form.
   *
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasErrors = false;

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name as keyof T, value as T[keyof T]);
      if (error) {
        newErrors[name as keyof T] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [formData, validateField]);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    validateForm,
  };
};
