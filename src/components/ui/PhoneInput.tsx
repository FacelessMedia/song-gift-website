'use client';

import React from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface PhoneInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean, e164?: string, display?: string, country?: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  onBlur?: () => void;
}

export default function PhoneInputComponent({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter your phone number",
  className = "",
  error,
  onBlur,
}: PhoneInputComponentProps) {
  const hasError = !!error;

  const handleChange = (
    phone: string,
    meta: { country: { iso2: string; dialCode: string; name: string }; inputValue: string }
  ) => {
    onChange(phone);

    // Validate: must have digits beyond just the country code prefix
    const digitCount = phone.replace(/\D/g, '').length;
    const isValid = digitCount >= 7 && phone.startsWith('+');

    if (isValid) {
      const display = meta.inputValue;
      const countryCode = meta.country.iso2.toUpperCase();
      onValidationChange(true, phone, display, countryCode);
    } else {
      onValidationChange(false);
    }
  };

  return (
    <div className={className}>
      <PhoneInput
        defaultCountry="us"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        inputProps={{
          onBlur,
        }}
      />

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      <style jsx global>{`
        /* SongGift phone input overrides */
        .react-international-phone-input-container {
          width: 100%;
          display: flex;
          align-items: center;
          border: 1px solid ${hasError ? '#ef4444' : 'rgba(194, 24, 91, 0.2)'};
          border-radius: 1rem;
          background: #fff;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          overflow: hidden;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .react-international-phone-input-container:focus-within {
          border-color: transparent;
          box-shadow: 0 0 0 2px #c2185b;
        }

        .react-international-phone-country-selector-button {
          border: none !important;
          background: transparent !important;
          padding: 0.75rem 0.5rem 0.75rem 0.75rem !important;
          margin: 0 !important;
          height: auto !important;
          border-right: 1px solid rgba(194, 24, 91, 0.1) !important;
          border-radius: 0 !important;
          cursor: pointer;
        }

        .react-international-phone-country-selector-button:hover {
          background: rgba(194, 24, 91, 0.05) !important;
        }

        .react-international-phone-country-selector-button__flag-emoji {
          margin-right: 2px;
        }

        .react-international-phone-country-selector-button__dropdown-arrow {
          border-top-color: #6b7280 !important;
          margin-left: 4px;
        }

        .react-international-phone-input {
          border: none !important;
          background: transparent !important;
          padding: 0.75rem !important;
          font-size: 1rem !important;
          line-height: 1.5 !important;
          color: #374151 !important;
          width: 100% !important;
          height: auto !important;
          font-family: var(--font-dm-sans), system-ui, -apple-system, sans-serif !important;
        }

        .react-international-phone-input::placeholder {
          color: rgba(107, 114, 128, 0.6) !important;
        }

        .react-international-phone-input:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        .react-international-phone-country-selector-dropdown {
          border-radius: 1rem !important;
          border: 1px solid rgba(194, 24, 91, 0.2) !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
          margin-top: 4px !important;
          z-index: 50 !important;
          overflow: hidden !important;
          max-height: 250px !important;
        }

        .react-international-phone-country-selector-dropdown__list-item {
          padding: 0.5rem 0.75rem !important;
          font-family: var(--font-dm-sans), system-ui, -apple-system, sans-serif !important;
          font-size: 0.875rem !important;
        }

        .react-international-phone-country-selector-dropdown__list-item:hover {
          background: rgba(194, 24, 91, 0.05) !important;
        }

        .react-international-phone-country-selector-dropdown__list-item--selected {
          background: rgba(194, 24, 91, 0.1) !important;
          font-weight: 600;
        }

        .react-international-phone-country-selector-dropdown__list-item--focused {
          background: rgba(194, 24, 91, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
