import { useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import Modal from '../Modal/Modal';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './RegisterUserModal.css';

export default function RegisterUserModal({ isOpen, onClose, title, fields, onSubmit, submitting, error, success }) {
  const initialValues = Object.fromEntries(fields.map((f) => [f.name, '']));
  const schema = Object.fromEntries(fields.map((f) => [f.name, f.validation ?? {}]));
  const { form, validate, fieldProps, resetForm } = useForm(initialValues, schema);

  useEffect(() => { if (!isOpen) resetForm(); }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className="register-modal-form" onSubmit={handleSubmit}>
        {error && <p className="register-modal-error">{error}</p>}
        {success && <p className="register-modal-success">{success}</p>}
        {fields.map((field) =>
          field.options ? (
            <div className="input-wrapper" key={field.name}>
              <label className="input-label" htmlFor={field.name}>{field.label}</label>
              <select id={field.name} className="input-field" disabled={submitting} {...fieldProps(field.name)}>
                <option value="">בחר...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {fieldProps(field.name).error && <span className="input-error-msg">{fieldProps(field.name).error}</span>}
            </div>
          ) : (
            <Input key={field.name} label={field.label} type={field.type ?? 'text'} placeholder={field.placeholder} disabled={submitting} {...fieldProps(field.name)} />
          )
        )}
        <Button type="submit" fullWidth disabled={submitting} size="lg">
          {submitting ? 'שומר...' : 'רשום'}
        </Button>
      </form>
    </Modal>
  );
}
